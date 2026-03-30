import { motion, AnimatePresence, Variants } from "framer-motion";
import { useState } from "react";
import {
  FaEye, FaEyeSlash, FaLock, FaEnvelope,
  FaChevronDown, FaChevronUp, FaTimes,
  FaUserFriends, FaArrowRight,
  FaGem, FaShieldAlt, FaRocket,
} from "react-icons/fa";
import { HiArrowLeft } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

const LOGO = "https://res.cloudinary.com/deahgtn57/image/upload/v1751616678/omelett%27s/public/image/ChatGPT_Image_Jun_29_2025_02_29_59_PM_vmvihs.png";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700&display=swap');
  
  * { margin: 0; padding: 0; box-sizing: border-box; }

  .lp {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow-x: hidden;
    background: linear-gradient(135deg, #0a0f0e 0%, #0d1a16 50%, #0a120f 100%);
  }

  /* Animated gradient orbs */
  .lp-orb {
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    filter: blur(80px);
    animation: float 20s ease-in-out infinite;
  }

  @keyframes float {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(30px, -30px) scale(1.1); }
    66% { transform: translate(-20px, 20px) scale(0.9); }
  }

  .lp-orb-1 { background: radial-gradient(circle, rgba(13,122,104,0.4) 0%, transparent 70%); width: 500px; height: 500px; top: -20%; left: -10%; animation-delay: 0s; }
  .lp-orb-2 { background: radial-gradient(circle, rgba(77,184,168,0.35) 0%, transparent 70%); width: 400px; height: 400px; bottom: -15%; right: -5%; animation-delay: 5s; }
  .lp-orb-3 { background: radial-gradient(circle, rgba(13,122,104,0.25) 0%, transparent 70%); width: 350px; height: 350px; top: 40%; right: 15%; animation-delay: 10s; }
  .lp-orb-4 { background: radial-gradient(circle, rgba(77,184,168,0.2) 0%, transparent 70%); width: 300px; height: 300px; bottom: 20%; left: 10%; animation-delay: 15s; }

  /* Grid pattern */
  .lp-grid {
    position: fixed;
    inset: 0;
    pointer-events: none;
    background-image: 
      linear-gradient(rgba(77,184,168,0.05) 1px, transparent 1px),
      linear-gradient(90deg, rgba(77,184,168,0.05) 1px, transparent 1px);
    background-size: 40px 40px;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 90%);
  }

  /* Back button */
  .lp-back {
    position: fixed;
    z-index: 300;
    width: 42px;
    height: 42px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255,255,255,0.08);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255,255,255,0.15);
    color: rgba(255,255,255,0.7);
    transition: all 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1);
    top: 20px;
    right: 20px;
    left: auto;
    cursor: pointer;
  }

  .lp-back:hover {
    background: rgba(13,122,104,0.6);
    color: white;
    transform: scale(1.1);
    border-color: rgba(13,122,104,0.8);
  }

  @media (min-width: 768px) {
    .lp-back { left: 20px; right: auto; }
  }

  .lp-back-x { display: flex; font-size: 22px; font-weight: 300; }
  .lp-back-arrow { display: none; }
  @media (min-width: 768px) {
    .lp-back-x { display: none; }
    .lp-back-arrow { display: flex; }
  }

  /* Main Card */
  .lp-card {
    position: relative;
    z-index: 10;
    width: 100%;
    max-width: 480px;
    margin: 20px;
    border-radius: 32px;
    overflow: hidden;
    background: rgba(10, 20, 18, 0.6);
    backdrop-filter: blur(40px) saturate(1.8);
    border: 1px solid rgba(77, 184, 168, 0.25);
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  }

  /* Card Header */
  .lp-header {
    text-align: center;
    padding: 32px 24px 24px;
    border-bottom: 1px solid rgba(77, 184, 168, 0.15);
  }

  .lp-logo {
    width: 80px;
    height: 80px;
    margin: 0 auto 16px;
    border-radius: 50%;
    background: rgba(13,122,104,0.2);
    border: 1px solid rgba(77,184,168,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .lp-logo img {
    width: 55px;
    height: auto;
  }

  .lp-title {
    font-size: 1.75rem;
    font-weight: 600;
    color: white;
    margin-bottom: 4px;
    letter-spacing: -0.5px;
  }

  .lp-sub {
    font-size: 0.8rem;
    color: rgba(255,255,255,0.4);
  }

  /* Form Content */
  .lp-content {
    padding: 28px 24px 32px;
  }

  .lp-notice {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    border-radius: 12px;
    background: rgba(13,122,104,0.12);
    border: 1px solid rgba(77,184,168,0.2);
    margin-bottom: 24px;
  }

  .lp-notice-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #4db8a8;
    box-shadow: 0 0 8px #4db8a8;
    animation: blink 2s infinite;
  }

  @keyframes blink {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 1; }
  }

  .lp-notice p {
    font-size: 0.7rem;
    color: rgba(255,255,255,0.45);
  }

  /* Form Fields */
  .lp-field {
    margin-bottom: 16px;
  }

  .lp-label {
    display: block;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
    color: rgba(77,184,168,0.8);
    margin-bottom: 6px;
  }

  .lp-input-wrap {
    position: relative;
  }

  .lp-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: rgba(77,184,168,0.5);
    font-size: 14px;
  }

  .lp-input {
    width: 100%;
    padding: 11px 14px 11px 42px;
    border-radius: 12px;
    border: 1px solid rgba(255,255,255,0.1);
    background: rgba(255,255,255,0.05);
    color: white;
    font-size: 0.85rem;
    transition: all 0.2s;
  }

  .lp-input:focus {
    outline: none;
    border-color: rgba(77,184,168,0.5);
    background: rgba(255,255,255,0.08);
    box-shadow: 0 0 0 3px rgba(13,122,104,0.1);
  }

  .lp-input::placeholder {
    color: rgba(255,255,255,0.2);
  }

  .lp-input-pw {
    padding-right: 44px;
  }

  .lp-eye {
    position: absolute;
    right: 14px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: rgba(255,255,255,0.3);
    cursor: pointer;
    transition: color 0.2s;
  }

  .lp-eye:hover {
    color: #4db8a8;
  }

  /* Terms Button */
  .lp-terms-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    border-radius: 12px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.6);
    font-size: 0.75rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .lp-terms-btn:hover {
    background: rgba(13,122,104,0.1);
    border-color: rgba(77,184,168,0.3);
  }

  .lp-terms-body {
    overflow: hidden;
    margin-top: 8px;
  }

  .lp-terms-inner {
    padding: 12px;
    border-radius: 12px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.06);
    font-size: 0.68rem;
    line-height: 1.6;
    color: rgba(255,255,255,0.35);
    max-height: 140px;
    overflow-y: auto;
  }

  .lp-terms-inner strong {
    color: #4db8a8;
    font-size: 0.65rem;
    text-transform: uppercase;
  }

  /* Checkbox */
  .lp-check {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 18px 0;
  }

  .lp-checkbox {
    width: 18px;
    height: 18px;
    border-radius: 5px;
    border: 1px solid rgba(77,184,168,0.4);
    background: rgba(255,255,255,0.05);
    cursor: pointer;
    appearance: none;
    position: relative;
    transition: all 0.2s;
    flex-shrink: 0;
  }

  .lp-checkbox:checked {
    background: #0d7a68;
    border-color: #0d7a68;
  }

  .lp-checkbox:checked::after {
    content: '';
    position: absolute;
    left: 5px;
    top: 2px;
    width: 5px;
    height: 9px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }

  .lp-check-label {
    font-size: 0.72rem;
    color: rgba(255,255,255,0.45);
    cursor: pointer;
    line-height: 1.4;
  }

  /* Submit Button */
  .lp-btn {
    width: 100%;
    padding: 12px;
    border-radius: 12px;
    border: none;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .lp-btn-on {
    background: linear-gradient(135deg, #0d7a68, #0a6455);
    color: white;
    box-shadow: 0 4px 15px rgba(13,122,104,0.3);
  }

  .lp-btn-on:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(13,122,104,0.4);
  }

  .lp-btn-off {
    background: rgba(255,255,255,0.05);
    color: rgba(255,255,255,0.2);
    cursor: not-allowed;
  }

  /* Footer */
  .lp-foot {
    text-align: center;
    margin-top: 20px;
    font-size: 0.7rem;
    color: rgba(255,255,255,0.3);
  }

  .lp-link {
    color: #4db8a8;
    background: none;
    border: none;
    cursor: pointer;
    font-weight: 600;
    transition: color 0.2s;
    font-size: 0.7rem;
  }

  .lp-link:hover {
    color: #7dd4c8;
  }

  /* Modal */
  .lp-modal-bg {
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(24px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  .lp-modal {
    position: relative;
    width: 100%;
    max-width: 400px;
    border-radius: 28px;
    background: rgba(10, 20, 18, 0.95);
    backdrop-filter: blur(40px);
    border: 1px solid rgba(77, 184, 168, 0.3);
    overflow: hidden;
  }

  .lp-modal-head {
    padding: 18px 20px 14px;
    border-bottom: 1px solid rgba(77, 184, 168, 0.15);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .lp-modal-head-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .lp-modal-icon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: rgba(13,122,104,0.2);
    border: 1px solid rgba(77,184,168,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #4db8a8;
    font-size: 16px;
  }

  .lp-modal-title {
    font-size: 0.95rem;
    font-weight: 700;
    color: white;
  }

  .lp-modal-sub {
    font-size: 0.65rem;
    color: rgba(255,255,255,0.4);
  }

  .lp-modal-close {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.1);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
  }

  .lp-modal-close:hover {
    background: rgba(13,122,104,0.5);
    transform: scale(1.05);
  }

  .lp-modal-body {
    padding: 14px 20px;
    max-height: 380px;
    overflow-y: auto;
  }

  .lp-modal-row {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 10px 12px;
    border-radius: 12px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.06);
    margin-bottom: 10px;
  }

  .lp-modal-row-icon {
    width: 34px;
    height: 34px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .lp-modal-row-title {
    font-size: 0.8rem;
    font-weight: 600;
    color: rgba(255,255,255,0.9);
    margin-bottom: 3px;
  }

  .lp-modal-row-desc {
    font-size: 0.68rem;
    color: rgba(255,255,255,0.4);
    line-height: 1.5;
  }

  .lp-modal-foot {
    padding: 12px 20px 18px;
    border-top: 1px solid rgba(77,184,168,0.1);
  }

  .lp-modal-btn {
    width: 100%;
    padding: 11px;
    border-radius: 12px;
    border: none;
    background: linear-gradient(135deg, #0d7a68, #0a6455);
    color: white;
    font-weight: 600;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .lp-modal-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(13,122,104,0.4);
  }

  .lp-modal-note {
    text-align: center;
    font-size: 0.58rem;
    color: rgba(255,255,255,0.2);
    margin-top: 8px;
  }

  @media (max-width: 480px) {
    .lp-card {
      max-width: calc(100% - 32px);
      margin: 16px;
    }
    .lp-header {
      padding: 24px 20px 20px;
    }
    .lp-content {
      padding: 24px 20px 28px;
    }
    .lp-title {
      font-size: 1.5rem;
    }
  }
`;

const itemV: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
};

const containerV: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const modalV: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.25 } },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } },
};

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleBack = () => {
    navigate(-1);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accepted) {
      alert("Please accept the invitation terms first.");
      return;
    }
    console.log("Login:", { email, password });
  };

  const handleRequestHelp = () => {
    setShowModal(false);
    navigate("/help");
  };

  return (
    <div className="lp">
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* Animated Background Elements */}
      <div className="lp-orb lp-orb-1" />
      <div className="lp-orb lp-orb-2" />
      <div className="lp-orb lp-orb-3" />
      <div className="lp-orb lp-orb-4" />
      <div className="lp-grid" />

      {/* Back Button */}
      <button onClick={handleBack} className="lp-back">
        <span className="lp-back-x">×</span>
        <span className="lp-back-arrow"><HiArrowLeft size={18} /></span>
      </button>

      {/* Main Card */}
      <motion.div
        className="lp-card"
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Header with Logo */}
        <div className="lp-header">
          <motion.div
            className="lp-logo"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <img src={LOGO} alt="Omelette's" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <h1 className="lp-title">Welcome To OMS</h1>
            <p className="lp-sub">Sign in to your account</p>
          </motion.div>
        </div>

        {/* Form Content */}
        <div className="lp-content">
          <motion.div variants={containerV} initial="hidden" animate="visible">
            <motion.div className="lp-notice" variants={itemV}>
              <div className="lp-notice-dot" />
              <p>Invitation-only platform for OMS members</p>
            </motion.div>

            <form onSubmit={onSubmit}>
              <motion.div className="lp-field" variants={itemV}>
                <label className="lp-label">EMAIL</label>
                <div className="lp-input-wrap">
                  <span className="lp-icon"><FaEnvelope /></span>
                  <input
                    type="email"
                    className="lp-input"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </motion.div>

              <motion.div className="lp-field" variants={itemV}>
                <label className="lp-label">PASSWORD</label>
                <div className="lp-input-wrap">
                  <span className="lp-icon"><FaLock /></span>
                  <input
                    type={showPw ? "text" : "password"}
                    className="lp-input lp-input-pw"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button type="button" className="lp-eye" onClick={() => setShowPw(!showPw)}>
                    {showPw ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </motion.div>

              <motion.div className="lp-field" variants={itemV}>
                <button type="button" className="lp-terms-btn" onClick={() => setShowTerms(!showTerms)}>
                  <span>Terms & Conditions</span>
                  {showTerms ? <FaChevronUp size={11} /> : <FaChevronDown size={11} />}
                </button>
                <AnimatePresence>
                  {showTerms && (
                    <motion.div
                      className="lp-terms-body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="lp-terms-inner">
                        <p><strong>1. Exclusive Membership</strong><br />OMS membership is by invitation only.</p>
                        <p><strong>2. Invitation Required</strong><br />You must receive a valid invitation from an existing member.</p>
                        <p><strong>3. Account Security</strong><br />You are responsible for your credentials.</p>
                        <p><strong>4. Exclusive Content</strong><br />All content is confidential for members only.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div className="lp-check" variants={itemV}>
                <input
                  type="checkbox"
                  id="terms"
                  className="lp-checkbox"
                  checked={accepted}
                  onChange={() => setAccepted(!accepted)}
                />
                <label htmlFor="terms" className="lp-check-label">
                  I have received an OMS invitation
                </label>
              </motion.div>

              <motion.button
                type="submit"
                disabled={!accepted}
                className={`lp-btn ${accepted ? "lp-btn-on" : "lp-btn-off"}`}
                variants={itemV}
                whileHover={accepted ? { scale: 1.01 } : {}}
                whileTap={accepted ? { scale: 0.99 } : {}}
              >
                Sign In <FaArrowRight size={12} />
              </motion.button>
            </form>

            <motion.div className="lp-foot" variants={itemV}>
              Don't have an account?{" "}
              <button className="lp-link" onClick={() => setShowModal(true)}>
                Request Invitation
              </button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>

      {/* Invitation Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="lp-modal-bg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div
              className="lp-modal"
              variants={modalV}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="lp-modal-head">
                <div className="lp-modal-head-left">
                  <div className="lp-modal-icon">
                    <FaGem />
                  </div>
                  <div>
                    <div className="lp-modal-title">Exclusive Membership</div>
                    <div className="lp-modal-sub">Invitation Only</div>
                  </div>
                </div>
                <button className="lp-modal-close" onClick={() => setShowModal(false)}>
                  <FaTimes />
                </button>
              </div>

              <div className="lp-modal-body">
                <div className="lp-modal-row">
                  <div className="lp-modal-row-icon" style={{ background: "rgba(13,122,104,0.2)", color: "#4db8a8" }}>
                    <FaUserFriends />
                  </div>
                  <div>
                    <div className="lp-modal-row-title">Invitation-Only Access</div>
                    <div className="lp-modal-row-desc">
                      OMS is an exclusive community. You need an invitation from an existing member to join.
                    </div>
                  </div>
                </div>

                <div className="lp-modal-row">
                  <div className="lp-modal-row-icon" style={{ background: "rgba(77,184,168,0.15)", color: "#4db8a8" }}>
                    <FaShieldAlt />
                  </div>
                  <div>
                    <div className="lp-modal-row-title">Secure & Verified</div>
                    <div className="lp-modal-row-desc">
                      All members are verified through our invitation system.
                    </div>
                  </div>
                </div>

                <div className="lp-modal-row">
                  <div className="lp-modal-row-icon" style={{ background: "rgba(13,122,104,0.2)", color: "#4db8a8" }}>
                    <FaRocket />
                  </div>
                  <div>
                    <div className="lp-modal-row-title">Premium Benefits</div>
                    <div className="lp-modal-row-desc">
                      Access exclusive models, early releases, and collector events.
                    </div>
                  </div>
                </div>
              </div>

              <div className="lp-modal-foot">
                <button className="lp-modal-btn" onClick={handleRequestHelp}>
                  Request Invitation Help
                </button>
                <div className="lp-modal-note">OMS — Exclusive Membership</div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}