import * as React from "react";
import { useTranslation } from "react-i18next";
import {
  FaWhatsapp, FaStar, FaCopy, FaCheck,
  FaMinus, FaPlus, FaBox, FaHeart, FaRegHeart, FaTrash
} from "react-icons/fa";
import DefaultLayout from "@/layouts/default";
import {
  AiOutlineLeft, AiOutlineRight,
  AiOutlineShoppingCart, AiOutlineArrowUp
} from "react-icons/ai";
import { FiSearch } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useDisclosure } from "@heroui/react";
import { IoClose, IoAirplane } from "react-icons/io5";
import Loading from "@/components/loading";
import { FaRegNoteSticky } from "react-icons/fa6";

const FLY_LOGO = "https://res.cloudinary.com/deahgtn57/image/upload/v1757573548/omelett%27s/public/image/fly_h2va9e.png";
const API_URL = import.meta.env.VITE_PRODUCT_DETAILS_API;
const WA_NUM = "8562055058028";

interface Product {
  ID: string; Name: string; Type: string; Size: string;
  "Qty Bought": number; "Final Selling Price": number;
  Status?: string; Notes?: string; Image?: string;
  Phone?: string; Logo?: string; Rating?: number;
  Images?: Record<string, string | null>;
  "Aircraft Type"?: string; "Material & Composition"?: string;
  "Assembly Required"?: string; "Age Group"?: string;
  Origin?: string; "Toy Type"?: string; "Gender Applicability"?: string;
}

interface OrderForm {
  productId: string; productName: string; price: number; quantity: number; notes: string;
}

interface CartItem extends Product {
  cartQuantity: number;
}

const BLANK: OrderForm = {
  productId: "", productName: "", price: 0, quantity: 1, notes: "",
};

// ═══ HELPERS ═══
function optImg(url: string, w = 1200) {
  if (!url?.includes("res.cloudinary.com")) return url || "";
  return url.replace("/upload/", `/upload/f_auto,q_auto:best,w_${w},c_limit/`);
}

const IMG_K = ["image_meain", ...Array.from({ length: 15 }, (_, i) => `image_${i + 1}`)];

function getImgs(p: Product): string[] {
  const r: string[] = [];
  if (p.Images) IMG_K.forEach(k => { const u = p.Images?.[k]; if (u?.trim()) r.push(optImg(u.trim())); });
  if (!r.length) { 
    if (p.Image?.trim()) r.push(optImg(p.Image.trim()));
    else if (p.Logo?.trim()) r.push(optImg(p.Logo.trim()));
    else r.push(FLY_LOGO); 
  }
  return r;
}

function getLogo(p: Product): string {
  if (p.Logo?.trim()) return optImg(p.Logo.trim());
  if (p.Image?.trim()) return optImg(p.Image.trim());
  return FLY_LOGO;
}

function mkId() { return `ORD-${Date.now().toString().slice(-6)}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`; }

// ═══ SUB COMPONENTS ═══
function AniPrice({ price }: { price: number }) {
  const [v, setV] = React.useState(0);
  React.useEffect(() => { let f = 0; const t = 90; const id = setInterval(() => { f++; setV(Math.round(price * f / t)); if (f >= t) { clearInterval(id); setV(price); } }, 1000 / 60); return () => clearInterval(id); }, [price]);
  return <motion.span className="c-pr" initial={{ opacity: 0, scale: .8 }} animate={{ opacity: 1, scale: 1 }}>{v.toLocaleString()} ₭</motion.span>;
}

function LzImg({ src, alt, className, style, onClick }: { src: string; alt: string; className?: string; style?: React.CSSProperties; onClick?: (e: React.MouseEvent) => void }) {
  const [ok, setOk] = React.useState(false);
  const bl = src.includes("res.cloudinary.com") ? src.replace("/upload/", "/upload/w_20,e_blur:800,q_1,f_auto/") : src;
  return (
    <div style={{ position: "relative", width: "100%", height: "100%", overflow: "hidden" }} onClick={onClick}>
      <img src={bl} aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain", filter: "blur(14px)", transform: "scale(1.06)", opacity: ok ? 0 : 1, transition: "opacity .5s", pointerEvents: "none" }} />
      {!ok && <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg,rgba(13,122,104,.05) 25%,rgba(13,122,104,.12) 50%,rgba(13,122,104,.05) 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s linear infinite", pointerEvents: "none" }} />}
      <img src={src} alt={alt} className={className} style={{ ...style, opacity: ok ? 1 : 0, transition: "opacity .5s" }} loading="lazy" decoding="async" onLoad={() => setOk(true)} />
    </div>
  );
}

// ═══ UPDATED OK MODAL - Better animation, no copy button ═══
function OkModal({ open, close, id }: { open: boolean; close: () => void; id: string }) {
  const [s, setS] = React.useState(3);
  
  React.useEffect(() => {
    if (!open) return;
    const t = setTimeout(close, 3000);
    const c = setInterval(() => setS(p => (p <= 1 ? (clearInterval(c), 0) : p - 1)), 1000);
    return () => { clearTimeout(t); clearInterval(c); setS(3); };
  }, [open, close]);
  
  if (!open) return null;
  
  return (
    <motion.div 
      style={{ 
        position: "fixed", 
        inset: 0, 
        zIndex: 1000010, 
        background: "rgba(10,28,25,.55)", 
        backdropFilter: "blur(16px)", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        padding: 16 
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={close}
    >
      <motion.div 
        style={{ 
          position: "relative", 
          width: "100%", 
          maxWidth: 420, 
          borderRadius: 28, 
          background: "rgba(255,255,255,.92)", 
          backdropFilter: "blur(32px)", 
          border: "1px solid rgba(255,255,255,.5)", 
          boxShadow: "0 32px 80px rgba(13,122,104,.25), 0 0 0 1px rgba(13,122,104,.05) inset", 
          overflow: "hidden", 
          textAlign: "center" 
        }}
        onClick={e => e.stopPropagation()} 
        initial={{ scale: .85, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: .85, y: 30, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 350 }}
      >
        {/* Progress bar */}
        <div className="ok-bar" />
        
        <div style={{ padding: "32px 24px 28px" }}>
          {/* Animated check mark */}
          <motion.div 
            style={{ 
              display: "flex", 
              justifyContent: "center", 
              marginBottom: 16 
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: "spring", damping: 15, stiffness: 300 }}
          >
            <div style={{ 
              width: 80, 
              height: 80, 
              borderRadius: "50%", 
              background: "linear-gradient(135deg, #0d7a68, #0a6455)",
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              boxShadow: "0 8px 32px rgba(13,122,104,.35)"
            }}>
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.25, type: "spring", damping: 15, stiffness: 300 }}
              >
                <FaCheck size={32} style={{ color: "#fff" }} />
              </motion.div>
            </div>
          </motion.div>
          
          <motion.p 
            style={{ fontSize: "1.3rem", fontWeight: 700, color: "#0a2e28", margin: "8px 0 4px" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Order Sent! ✈️
          </motion.p>
          
          <motion.p 
            style={{ fontSize: ".75rem", color: "rgba(10,46,40,.4)", marginBottom: 12 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Your order is on its way to WhatsApp
          </motion.p>
          
          <motion.div 
            style={{ 
              margin: "16px 0 8px", 
              borderRadius: 14, 
              padding: "10px 16px", 
              background: "rgba(13,122,104,.06)", 
              border: "1px solid rgba(13,122,104,.1)" 
            }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <p style={{ fontSize: ".6rem", fontWeight: 700, letterSpacing: 3, textTransform: "uppercase", color: "#0d7a68", margin: "0 0 4px" }}>Order ID</p>
            <code style={{ fontSize: ".9rem", color: "#0d7a68", fontWeight: 600 }}>{id}</code>
          </motion.div>
          
          <motion.p 
            style={{ fontSize: ".7rem", color: "rgba(10,46,40,.3)", marginTop: 8 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Closing in {s}s
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ═══ CART SUMMARY MODAL ═══
function CartSummaryModal({ 
  open, 
  onClose, 
  items, 
  total, 
  onConfirm 
}: { 
  open: boolean; 
  onClose: () => void; 
  items: CartItem[]; 
  total: number; 
  onConfirm: () => void;
}) {
  if (!open) return null;

  return (
    <motion.div 
      className="om-bg cart-summary-modal" 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }} 
      onClick={onClose}
    >
      <div className="om-orb" style={{ width: 440, height: 440, top: "-15%", left: "-8%", background: "radial-gradient(circle,rgba(13,122,104,.25) 0%,transparent 60%)", filter: "blur(50px)" }} />
      <div className="om-orb" style={{ width: 340, height: 340, bottom: "-15%", right: "-5%", background: "radial-gradient(circle,rgba(77,184,168,.2) 0%,transparent 60%)", filter: "blur(44px)" }} />
      <div className="om-wr">
        <motion.div 
          className="om-pn" 
          onClick={e => e.stopPropagation()} 
          initial={{ opacity: 0, y: 24, scale: .96 }} 
          animate={{ opacity: 1, y: 0, scale: 1 }} 
          exit={{ opacity: 0, y: 24, scale: .96 }} 
          transition={{ duration: .25, ease: [.22, 1, .36, 1] }}
        >
          <button className="om-cl" onClick={onClose}><IoClose size={14} /></button>
          <div className="om-hd">
            <div className="om-tl">
              <div className="om-ic"><AiOutlineShoppingCart size={14} /></div>
              <span>Review Your Order</span>
            </div>
          </div>
          <div className="om-bd">
            <div className="bk">
              <div className="bk-t"><div className="bk-i"><FaBox size={10} /></div> Cart Items ({items.length})</div>
              <div className="cart-summary-items">
                {items.map((item, idx) => (
                  <div key={idx} className="cart-summary-item">
                    <span className="name">{item.Name}</span>
                    <span className="qty">×{item.cartQuantity}</span>
                    <span className="price" style={{ color: '#22c55e' }}>{(item["Final Selling Price"] * item.cartQuantity).toLocaleString()} ₭</span>
                  </div>
                ))}
              </div>
              <div className="bk-hr" />
              <div className="bk-r">
                <span style={{ fontWeight: 700, color: "#0d7a68" }}>Total</span>
                <span className="bk-v" style={{ color: "#22c55e", fontWeight: 800, fontSize: "1.2rem" }}>
                  {total.toLocaleString()} ₭
                </span>
              </div>
            </div>
            <div className="bk">
              <div className="bk-t"><div className=""><FaRegNoteSticky size={15} /></div> Anything Else?</div>
              <div className="fw">
                <textarea 
                  className="fta" 
                  placeholder="Add a note for us — color preference, gift message, special request… (optional)" 
                  rows={2} 
                  id="cart-note"
                />
              </div>
            </div>
          </div>
          <div className="om-ft">
            <button className="om-cn" onClick={onClose}>Cancel</button>
            <button className="om-wa" onClick={onConfirm}>
              <FaWhatsapp size={16} /> Send to WhatsApp
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

// ═══ CSS ═══
const css = `
@import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;700&display=swap');
*,:before,:after{box-sizing:border-box}
.root,.root *{font-family:'Ubuntu',sans-serif}
@keyframes shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
@keyframes glow{0%,100%{box-shadow:0 0 0 0 rgba(13,122,104,.35)}50%{box-shadow:0 0 0 7px rgba(13,122,104,0)}}
@keyframes cardIn{from{opacity:0;transform:translateY(16px) scale(.97)}to{opacity:1;transform:none}}
@keyframes priceIn{from{opacity:0;transform:translateY(5px)}to{opacity:1;transform:none}}
@keyframes barShrink{0%{width:100%}100%{width:0}}
@keyframes heartBeat{0%,100%{transform:scale(1)}50%{transform:scale(1.3)}}

.pg{min-height:100vh;background:#f4f8f7}
.dark .pg{background:#0f1a18}

/* 🛒 Floating Cart Button - Mobile Optimized */
.floating-cart-btn {
  position: fixed;
  bottom: 120px;
  right: 24px;
  z-index: 9998;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0d7a68, #0a6455);
  border: 2px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 32px rgba(13, 122, 104, 0.4), 0 2px 8px rgba(0, 0, 0, 0.15);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  backdrop-filter: blur(8px);
  animation: floatAnimation 3s ease-in-out infinite;
}

.floating-cart-btn:hover {
  transform: scale(1.12) translateY(-4px);
  box-shadow: 0 16px 48px rgba(13, 122, 104, 0.55), 0 0 60px rgba(13, 122, 104, 0.15);
}

.floating-cart-btn .cart-icon {
  font-size: 24px;
  transition: transform 0.3s ease;
}

.floating-cart-btn:hover .cart-icon {
  transform: rotate(-10deg) scale(1.1);
}

.floating-cart-btn .cart-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #E43636;
  color: #fff;
  font-size: 0.6rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6px;
  border: 2px solid #fff;
  box-shadow: 0 2px 12px rgba(228, 54, 54, 0.5);
  animation: badgePop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.floating-cart-btn .cart-tooltip {
  position: absolute;
  right: 68px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(10, 46, 40, 0.92);
  backdrop-filter: blur(12px);
  color: #fff;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.floating-cart-btn:hover .cart-tooltip {
  opacity: 1;
  transform: translateY(-50%) translateX(-8px);
}

.floating-cart-btn .cart-tooltip::after {
  content: '';
  position: absolute;
  right: -6px;
  top: 50%;
  transform: translateY(-50%);
  border-left: 6px solid rgba(10, 46, 40, 0.92);
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
}

@keyframes floatAnimation {
  0%, 100% { 
    transform: translateY(0px);
  }
  50% { 
    transform: translateY(-8px);
  }
}

@keyframes badgePop {
  0% { 
    transform: scale(0);
    opacity: 0;
  }
  100% { 
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes cartPulse {
  0%, 100% { 
    transform: scale(1);
    box-shadow: 0 8px 32px rgba(13, 122, 104, 0.4), 0 0 0 0 rgba(13, 122, 104, 0.4);
  }
  50% { 
    transform: scale(1.05);
    box-shadow: 0 8px 32px rgba(13, 122, 104, 0.5), 0 0 40px 8px rgba(13, 122, 104, 0.2);
  }
}

.floating-cart-btn.has-items {
  animation: floatAnimation 3s ease-in-out infinite, cartPulse 2s ease-in-out infinite;
}

/* Cart Sidebar */
.cart-overlay{position:fixed;inset:0;z-index:9999;background:rgba(10,28,25,.5);backdrop-filter:blur(8px)}
.cart-sidebar{position:fixed;top:0;right:0;z-index:10000;width:100%;max-width:420px;height:100%;background:rgba(255,255,255,.95);backdrop-filter:blur(24px);box-shadow:-8px 0 40px rgba(0,0,0,.15);display:flex;flex-direction:column;overflow:hidden}
.dark .cart-sidebar{background:rgba(26,46,41,.95)}
.cart-header{display:flex;align-items:center;justify-content:space-between;padding:18px 24px;border-bottom:1px solid rgba(13,122,104,.1);flex-shrink:0}
.cart-header h2{font-size:1.1rem;font-weight:700;color:#0a2e28;display:flex;align-items:center;gap:8px}
.dark .cart-header h2{color:#e5f5f2}
.cart-close{width:36px;height:36px;border-radius:50%;background:rgba(228,54,54,.1);border:1px solid rgba(228,54,54,.2);color:#E43636;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s}
.cart-close:hover{background:rgba(228,54,54,.85);color:#fff}
.cart-body{flex:1;overflow-y:auto;padding:16px 20px}
.cart-empty{text-align:center;padding:60px 20px;color:rgba(10,46,40,.4)}
.dark .cart-empty{color:rgba(255,255,255,.4)}
.cart-empty svg{font-size:4rem;opacity:.3;margin-bottom:16px}
.cart-item{display:flex;gap:14px;padding:12px 0;border-bottom:1px solid rgba(13,122,104,.08);align-items:center}
.cart-item-img{width:60px;height:60px;border-radius:10px;object-fit:contain;background:#f0f5f4;flex-shrink:0;padding:4px}
.dark .cart-item-img{background:#1a2e29}
.cart-item-info{flex:1;min-width:0}
.cart-item-name{font-size:.82rem;font-weight:600;color:#0a2e28;margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dark .cart-item-name{color:#e5f5f2}
.cart-item-price{font-size:.78rem;color:#E43636;font-weight:700}
.cart-item-qty{display:flex;align-items:center;gap:8px;margin-top:4px}
.cart-item-qty button{width:24px;height:24px;border-radius:50%;background:rgba(13,122,104,.1);border:1px solid rgba(13,122,104,.2);color:#0d7a68;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:.7rem;transition:all .2s}
.cart-item-qty button:hover{background:rgba(13,122,104,.2)}
.cart-item-qty span{font-weight:600;font-size:.85rem;color:#0a2e28;min-width:20px;text-align:center}
.dark .cart-item-qty span{color:#e5f5f2}
.cart-item-remove{background:none;border:none;color:rgba(228,54,54,.4);cursor:pointer;padding:4px;transition:all .2s}
.cart-item-remove:hover{color:#E43636;transform:scale(1.1)}
.cart-footer{padding:16px 20px 20px;border-top:1px solid rgba(13,122,104,.1);flex-shrink:0;background:rgba(255,255,255,.9)}
.dark .cart-footer{background:rgba(26,46,41,.9)}
.cart-total{display:flex;justify-content:space-between;font-size:1rem;font-weight:700;color:#0a2e28;margin-bottom:12px}
.dark .cart-total{color:#e5f5f2}
.cart-total span:last-child{color:#E43636;font-size:1.2rem}

/* Order Now & Clear in one line */
.cart-actions {
  display: flex;
  gap: 8px;
}

.cart-actions .cart-checkout {
  flex: 2;
}

.cart-actions .cart-clear {
  flex: 1;
  margin-top: 0;
}

/* Updated Order Now Button */
.cart-checkout {
  padding: 12px 20px;
  border-radius: 12px;
  background: linear-gradient(135deg, #0d7a68, #0a6455);
  color: #fff;
  font-weight: 700;
  font-size: 0.95rem;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 4px 20px rgba(13, 122, 104, 0.35);
  position: relative;
  overflow: hidden;
}

.cart-checkout::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 200%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
  transition: left 0.5s ease;
}

.cart-checkout:hover::before {
  left: 100%;
}

.cart-checkout:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(13, 122, 104, 0.45);
}

.cart-checkout:active {
  transform: translateY(0px) scale(0.98);
}

.cart-checkout .btn-icon {
  font-size: 20px;
  transition: transform 0.3s ease;
}

.cart-checkout:hover .btn-icon {
  transform: translateX(4px) scale(1.1);
}

.cart-clear {
  padding: 12px 16px;
  border-radius: 12px;
  background: rgba(228,54,54,.08);
  border: 1.5px solid rgba(228,54,54,.2);
  color: #E43636;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.cart-clear:hover {
  background: rgba(228,54,54,.15);
  transform: scale(1.02);
}

/* Heart/Favorite Button - Enhanced Dark/Light Mode */
.fav-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 15;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  border: 1.5px solid rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
  color: #E43636;
}

.fav-btn svg {
  transition: all 0.3s ease;
}

.fav-btn:hover {
  transform: scale(1.15);
  box-shadow: 0 4px 20px rgba(228, 54, 54, 0.25);
}

.fav-btn:hover svg {
  transform: scale(1.1);
}

.fav-btn.active {
  background: #E43636;
  border-color: #E43636;
  color: #fff;
  box-shadow: 0 4px 20px rgba(228, 54, 54, 0.4);
}

.fav-btn.active:hover {
  transform: scale(1.15);
  box-shadow: 0 6px 28px rgba(228, 54, 54, 0.5);
}

.fav-btn.active svg {
  color: #fff;
  animation: heartBeat 0.6s ease;
}

.dark .fav-btn {
  background: rgba(26, 46, 41, 0.9);
  border-color: rgba(255, 255, 255, 0.12);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}

.dark .fav-btn.active {
  background: #E43636;
  border-color: #E43636;
  color: #fff;
}

.dark .fav-btn:not(.active) {
  color: rgba(228, 54, 54, 0.7);
}

.dark .fav-btn:not(.active):hover {
  color: #E43636;
  box-shadow: 0 4px 20px rgba(228, 54, 54, 0.2);
}

@keyframes heartBeat {
  0%, 100% { transform: scale(1); }
  25% { transform: scale(1.3); }
  50% { transform: scale(1); }
  75% { transform: scale(1.2); }
}

/* Header */
.hdr{position:relative;overflow:hidden;background:linear-gradient(135deg,#050e0c,#0d7a68 55%,#0a5a4c);padding:72px 24px 60px;text-align:center}
.hdr-grid{position:absolute;inset:0;pointer-events:none;background-image:linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px);background-size:48px 48px}
.hdr-orb{position:absolute;border-radius:50%;filter:blur(60px);pointer-events:none}
.hdr h1{position:relative;z-index:2;font-size:clamp(3rem,9vw,6rem);font-weight:700;letter-spacing:-1px;line-height:1;background:linear-gradient(135deg,#fff,#7dd4c8 42%,#fff);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:shimmer 4s linear infinite}
.hdr h1 em{-webkit-text-fill-color:#E43636;font-style:normal}
.hdr-sub{position:relative;z-index:2;margin-top:10px;font-size:clamp(.85rem,2vw,1.1rem);color:rgba(255,255,255,.6);letter-spacing:2px;text-transform:uppercase}
.pill{position:relative;z-index:2;display:inline-flex;align-items:center;gap:7px;margin-top:18px;padding:6px 18px;border-radius:20px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.18);color:rgba(255,255,255,.78);font-size:.72rem;font-weight:600;letter-spacing:2px;text-transform:uppercase}
.pill-dot{width:7px;height:7px;border-radius:50%;background:#4db8a8;box-shadow:0 0 6px #4db8a8}

.sw{display:flex;justify-content:center;padding:28px 16px 12px}
.si{position:relative;width:100%;max-width:520px}
.sg{position:relative;border-radius:50px;background:#fff;border:1.5px solid rgba(13,122,104,.18);box-shadow:0 2px 12px rgba(13,122,104,.1),0 6px 24px rgba(0,0,0,.06);transition:box-shadow .25s,border-color .25s;overflow:hidden}
.sg:focus-within{border-color:rgba(13,122,104,.5);box-shadow:0 2px 12px rgba(13,122,104,.15),0 8px 28px rgba(13,122,104,.12),0 0 0 4px rgba(13,122,104,.07)}
.dark .sg{background:rgba(255,255,255,.07);backdrop-filter:blur(20px);border-color:rgba(77,184,168,.22)}
.dark .sg:focus-within{border-color:rgba(77,184,168,.5)}
.sg input{width:100%;padding:13px 44px 13px 50px;border-radius:50px;border:none;background:transparent;color:#0a2e28;font-size:.93rem;font-family:inherit;outline:none}
.dark .sg input{color:#e5f5f2}
.sg input::placeholder{color:rgba(13,122,104,.4)}
.dark .sg input::placeholder{color:rgba(77,184,168,.4)}
.s-ico{position:absolute;left:17px;top:50%;transform:translateY(-50%);color:#0d7a68;pointer-events:none;z-index:2}
.s-clr{position:absolute;right:12px;top:50%;transform:translateY(-50%);background:rgba(13,122,104,.08);border:1px solid rgba(13,122,104,.15);border-radius:50%;width:26px;height:26px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:#0d7a68;transition:all .2s;z-index:2}
.s-clr:hover{background:rgba(228,54,54,.1);color:#E43636}

.cnt{text-align:center;font-size:.72rem;letter-spacing:2px;text-transform:uppercase;color:rgba(13,122,104,.6);margin-bottom:4px}
.grd{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:26px;padding:8px 0 44px}
.crd{background:#fff;border-radius:20px;overflow:hidden;border:1px solid rgba(13,122,104,.1);box-shadow:0 4px 22px rgba(0,0,0,.07);display:flex;flex-direction:column;animation:cardIn .5s ease both;transition:box-shadow .3s,transform .3s}
.dark .crd{background:#1a2e29;border-color:rgba(77,184,168,.14)}
.crd:hover{box-shadow:0 22px 55px rgba(0,0,0,.14);transform:translateY(-4px)}

.c-iz{position:relative;height:250px;overflow:hidden;background:#0a0f0e}
.c-bl{position:absolute;inset:0;background-size:cover;background-position:center;filter:blur(18px);transform:scale(1.12);opacity:.55}
.c-dm{position:absolute;inset:0;background:rgba(0,0,0,.1)}
.c-mi{position:relative;z-index:2;width:100%;height:100%;object-fit:contain;transition:transform .5s;cursor:zoom-in}
.crd:hover .c-mi{transform:scale(1.04)}
.c-bg{position:absolute;top:10px;left:10px;z-index:15;padding:3px 10px;border-radius:5px;font-size:.6rem;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;background:#0d7a68;color:#fff}
.c-nv{position:absolute;top:50%;transform:translateY(-50%);z-index:20;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;border:1px solid rgba(255,255,255,.28);background:rgba(255,255,255,.14);backdrop-filter:blur(16px);box-shadow:0 4px 16px rgba(0,0,0,.28);color:#fff;transition:background .2s,transform .18s}
.c-nv:hover{background:rgba(13,122,104,.55);transform:translateY(-50%) scale(1.1)}
.c-nv-l{left:10px}.c-nv-r{right:10px}
.c-ds{position:absolute;bottom:8px;left:50%;transform:translateX(-50%);display:flex;gap:4px;z-index:10}
.c-dt{width:5px;height:5px;border-radius:50%;background:rgba(255,255,255,.42);border:none;padding:0;cursor:pointer;transition:all .25s}
.c-dt.on{background:#0d7a68;width:16px;border-radius:3px}

.c-bd{padding:18px;flex:1;display:flex;flex-direction:column}
.c-nm{font-size:1.05rem;font-weight:700;color:#0d7a68;line-height:1.25;margin-bottom:2px}
.dark .c-nm{color:#7dd4c8}
.c-pr{font-size:1.12rem;font-weight:700;color:#E43636;animation:priceIn .5s ease both}
.c-st{display:flex;align-items:center;gap:2px;margin:6px 0 2px}
.c-sn{font-size:.72rem;color:rgba(0,0,0,.38);margin-left:4px}
.dark .c-sn{color:rgba(255,255,255,.32)}
.c-mt{display:flex;flex-direction:column;gap:3px;margin-top:6px}
.c-mt p{font-size:.8rem;color:rgba(0,0,0,.45);margin:0}
.dark .c-mt p{color:rgba(255,255,255,.38)}
.c-mt span{color:#0d7a68;font-weight:600}
.dark .c-mt span{color:#4db8a8}
.c-bt{margin-top:16px;display:inline-flex;align-items:center;justify-content:center;gap:8px;background:linear-gradient(135deg,#0d7a68,#0a6455);color:#fff;font-size:.88rem;font-weight:600;font-family:inherit;padding:11px 22px;border-radius:50px;border:none;cursor:pointer;box-shadow:0 6px 20px rgba(13,122,104,.32);animation:glow 2.5s infinite;transition:transform .2s,box-shadow .3s}
.c-bt:hover{transform:translateY(-1px);box-shadow:0 10px 28px rgba(13,122,104,.48)}
.emp{text-align:center;padding:72px 16px;color:rgba(0,0,0,.38)}
.dark .emp{color:rgba(255,255,255,.28)}

.go-top{position:fixed;bottom:max(env(safe-area-inset-bottom,0px)+80px,80px);right:20px;z-index:9000;width:44px;height:44px;border-radius:50%;border:1px solid rgba(255,255,255,.3);background:rgba(13,122,104,.72);backdrop-filter:blur(20px);box-shadow:0 4px 16px rgba(13,122,104,.45);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s}
.go-top:hover{background:rgba(13,122,104,.95);transform:translateY(-3px)}

/* Lightbox */
.lb-bg{position:fixed;inset:0;z-index:1000000;background:rgba(0,0,0,.96);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 24px 80px}
.lb-top{position:fixed;top:0;left:0;right:0;z-index:1000002;display:flex;align-items:center;justify-content:space-between;padding:12px 16px}
.lb-cnt{padding:5px 14px;border-radius:20px;background:rgba(255,255,255,.12);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.2);color:#fff;font-size:.75rem;letter-spacing:2px;font-family:'Ubuntu',sans-serif}
.lb-x{width:40px;height:40px;border-radius:50%;background:rgba(228,54,54,.6);border:1px solid rgba(255,255,255,.3);backdrop-filter:blur(12px);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s}
.lb-x:hover{background:rgba(228,54,54,.9);transform:scale(1.1)}
.lb-center{flex:1;display:flex;align-items:center;justify-content:center;width:100%;position:relative;min-height:0}
.lb-img{max-width:100%;max-height:100%;object-fit:contain;border-radius:8px;user-select:none;-webkit-user-drag:none}
.lb-arr{position:fixed;top:50%;transform:translateY(-50%);z-index:1000002;width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;background:rgba(255,255,255,.1);backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,.22);color:#fff;transition:all .2s}
.lb-arr:hover{background:rgba(13,122,104,.5);transform:translateY(-50%) scale(1.08)}
.lb-arr-l{left:12px}.lb-arr-r{right:12px}
.lb-bot{position:fixed;bottom:0;left:0;right:0;z-index:1000002;display:flex;justify-content:center;padding:10px 16px max(env(safe-area-inset-bottom,0px)+10px,14px)}
.lb-ths{display:flex;gap:5px;padding:6px 8px;border-radius:14px;background:rgba(255,255,255,.1);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,.18);max-width:calc(100vw - 32px);overflow-x:auto;scrollbar-width:none}
.lb-ths::-webkit-scrollbar{display:none}
.lb-th{width:44px;height:33px;border-radius:6px;object-fit:cover;border:2px solid transparent;opacity:.4;cursor:pointer;transition:all .2s;flex-shrink:0}
.lb-th:hover{opacity:.75}
.lb-th.on{border-color:#4db8a8;opacity:1}

/* Order Modal */
.om-bg{position:fixed;inset:0;z-index:99999;background:rgba(10,28,25,.45);backdrop-filter:blur(14px);overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;overscroll-behavior-y:contain}
.om-bg::before{content:'';position:fixed;inset:0;pointer-events:none;opacity:.05;background-image:radial-gradient(circle at 1px 1px,rgba(13,122,104,1) 1px,transparent 0);background-size:26px 26px;z-index:0}
.om-orb{position:fixed;pointer-events:none;border-radius:50%;z-index:0}
.om-wr{position:relative;z-index:1;display:flex;justify-content:center;padding:24px 16px 40px;min-height:100%}
.om-pn{width:100%;max-width:560px;border-radius:24px;background:rgba(255,255,255,.85);backdrop-filter:blur(24px);border:1px solid rgba(255,255,255,.6);box-shadow:0 24px 80px rgba(13,122,104,.18),0 1px 0 rgba(255,255,255,.7) inset;overflow:hidden;align-self:flex-start;position:relative}
.dark .om-pn{background:rgba(26,46,41,.92);border-color:rgba(77,184,168,.2);box-shadow:0 24px 80px rgba(0,0,0,.4)}
.om-pn::before{content:'';position:absolute;top:0;left:15%;right:15%;height:1px;background:linear-gradient(90deg,transparent,rgba(13,122,104,.3) 50%,transparent);pointer-events:none}
.dark .om-pn::before{background:linear-gradient(90deg,transparent,rgba(77,184,168,.2) 50%,transparent)}
.om-cl{position:absolute;top:14px;right:14px;z-index:10;width:30px;height:30px;border-radius:50%;background:rgba(228,54,54,.1);backdrop-filter:blur(10px);border:1px solid rgba(228,54,54,.2);color:#E43636;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s}
.om-cl:hover{background:rgba(228,54,54,.85);color:#fff;transform:scale(1.1)}
.om-hd{padding:18px 48px 14px 20px;border-bottom:1px solid rgba(13,122,104,.1)}
.dark .om-hd{border-bottom:1px solid rgba(77,184,168,.1)}
.om-tl{display:flex;align-items:center;gap:8px;font-size:.95rem;font-weight:700;color:#0a2e28}
.dark .om-tl{color:#e5f5f2}
.om-ic{width:30px;height:30px;border-radius:9px;background:rgba(13,122,104,.12);border:1px solid rgba(13,122,104,.25);display:flex;align-items:center;justify-content:center;color:#0d7a68;flex-shrink:0}
.dark .om-ic{background:rgba(77,184,168,.15);border-color:rgba(77,184,168,.2);color:#4db8a8}
.om-bd{padding:16px 20px;display:flex;flex-direction:column;gap:12px}
.bk{border-radius:14px;padding:14px;background:rgba(13,122,104,.05);border:1px solid rgba(13,122,104,.12);position:relative}
.dark .bk{background:rgba(77,184,168,.08);border-color:rgba(77,184,168,.15)}
.bk::before{content:'';position:absolute;top:0;left:10%;right:10%;height:1px;background:linear-gradient(90deg,transparent,rgba(13,122,104,.15),transparent);pointer-events:none}
.dark .bk::before{background:linear-gradient(90deg,transparent,rgba(77,184,168,.15),transparent)}
.bk-t{display:flex;align-items:center;gap:7px;font-size:.66rem;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#0d7a68;margin-bottom:10px}
.dark .bk-t{color:#4db8a8}
.bk-i{width:22px;height:22px;border-radius:6px;background:rgba(13,122,104,.12);border:1px solid rgba(13,122,104,.25);display:flex;align-items:center;justify-content:center;color:#0d7a68;flex-shrink:0}
.dark .bk-i{background:rgba(77,184,168,.15);border-color:rgba(77,184,168,.2);color:#4db8a8}
.bk-r{display:flex;justify-content:space-between;align-items:center;font-size:.8rem;color:rgba(10,46,40,.5);padding:3px 0}
.dark .bk-r{color:rgba(255,255,255,.4)}
.bk-v{color:#0a2e28;font-weight:600;text-align:right;max-width:60%;word-break:break-word}
.dark .bk-v{color:#e5f5f2}
.bk-hr{height:1px;background:linear-gradient(90deg,transparent,rgba(13,122,104,.12),transparent);margin:4px 0}
.dark .bk-hr{background:linear-gradient(90deg,transparent,rgba(77,184,168,.12),transparent)}
.fw{margin-bottom:8px}
.fl{font-size:.66rem;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:rgba(10,46,40,.4);margin-bottom:4px;display:block}
.dark .fl{color:rgba(255,255,255,.3)}
.fta{width:100%;padding:10px 12px;border-radius:10px;background:rgba(13,122,104,.05);border:1px solid rgba(13,122,104,.15);color:#0a2e28;font-size:.84rem;font-family:inherit;resize:vertical;min-height:56px;outline:none;transition:border-color .2s}
.dark .fta{background:rgba(77,184,168,.06);border-color:rgba(77,184,168,.15);color:#e5f5f2}
.fta::placeholder{color:rgba(10,46,40,.3)}
.dark .fta::placeholder{color:rgba(255,255,255,.2)}
.fta:focus{border-color:rgba(13,122,104,.4);background:rgba(13,122,104,.08)}
.dark .fta:focus{border-color:rgba(77,184,168,.4);background:rgba(77,184,168,.08)}
.qt{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;background:rgba(13,122,104,.05);border-radius:12px;border:1px solid rgba(13,122,104,.12)}
.dark .qt{background:rgba(77,184,168,.06);border-color:rgba(77,184,168,.12)}
.qt-l{font-size:.82rem;color:rgba(10,46,40,.5)}
.dark .qt-l{color:rgba(255,255,255,.3)}
.qt-c{display:flex;align-items:center;gap:14px}
.qt-b{width:32px;height:32px;border-radius:50%;background:rgba(13,122,104,.12);border:1px solid rgba(13,122,104,.3);color:#0d7a68;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .2s}
.dark .qt-b{background:rgba(77,184,168,.12);border-color:rgba(77,184,168,.25);color:#4db8a8}
.qt-b:hover{background:rgba(13,122,104,.22);transform:scale(1.05)}
.dark .qt-b:hover{background:rgba(77,184,168,.2)}
.qt-v{font-size:1.05rem;font-weight:700;color:#0a2e28;min-width:36px;text-align:center}
.dark .qt-v{color:#e5f5f2}
.tot{display:flex;justify-content:space-between;align-items:center;padding:12px 14px;background:linear-gradient(135deg,rgba(13,122,104,.1),rgba(13,122,104,.03));border-radius:12px;border:1px solid rgba(13,122,104,.18)}
.dark .tot{background:linear-gradient(135deg,rgba(77,184,168,.1),rgba(77,184,168,.03));border-color:rgba(77,184,168,.15)}
.tot-l{font-weight:700;color:#0d7a68;font-size:.85rem}
.dark .tot-l{color:#4db8a8}
.tot-v{font-size:1.2rem;font-weight:800;color:#E43636}
.om-ft{padding:14px 20px 20px;border-top:1px solid rgba(13,122,104,.1);display:flex;gap:10px;justify-content:flex-end;background:rgba(255,255,255,.9);position:sticky;bottom:0;z-index:5}
.dark .om-ft{background:rgba(26,46,41,.92);border-top:1px solid rgba(77,184,168,.1)}
.om-cn{padding:10px 18px;border-radius:10px;background:rgba(13,122,104,.06);border:1px solid rgba(13,122,104,.15);color:rgba(10,46,40,.5);font-size:.84rem;font-family:inherit;cursor:pointer;transition:all .2s}
.dark .om-cn{background:rgba(77,184,168,.06);border-color:rgba(77,184,168,.15);color:rgba(255,255,255,.4)}
.om-cn:hover{border-color:#E43636;color:#E43636;background:rgba(228,54,54,.06)}
.om-wa{display:inline-flex;align-items:center;gap:7px;background:linear-gradient(135deg,#25d366,#128c7e);color:#fff;font-weight:700;font-size:.84rem;font-family:inherit;padding:10px 18px;border-radius:10px;border:none;cursor:pointer;box-shadow:0 4px 16px rgba(37,211,102,.25);transition:all .2s}
.om-wa:hover{box-shadow:0 8px 24px rgba(37,211,102,.4);transform:translateY(-1px)}
.ok-bar{position:absolute;bottom:0;left:0;height:3px;background:linear-gradient(90deg,#4db8a8,#0d7a68);animation:barShrink 3s linear forwards}

/* Cart Checkout Summary Modal */
.cart-summary-modal .om-pn{max-width:600px}
.cart-summary-items{max-height:300px;overflow-y:auto;margin:4px 0 8px}
.cart-summary-items::-webkit-scrollbar{width:4px}
.cart-summary-items::-webkit-scrollbar-track{background:rgba(13,122,104,.05);border-radius:4px}
.cart-summary-items::-webkit-scrollbar-thumb{background:rgba(13,122,104,.3);border-radius:4px}
.cart-summary-item{display:flex;justify-content:space-between;align-items:center;padding:6px 0;border-bottom:1px solid rgba(13,122,104,.06);font-size:.8rem}
.cart-summary-item .name{color:#0a2e28;font-weight:500;flex:1}
.dark .cart-summary-item .name{color:#e5f5f2}
.cart-summary-item .qty{color:rgba(10,46,40,.5);margin:0 8px}
.dark .cart-summary-item .qty{color:rgba(255,255,255,.4)}
.cart-summary-item .price{font-weight:600;white-space:nowrap}

/* Dark mode fixes for cart images - LOGO visibility */
.dark .cart-item-img {
  background: rgba(255,255,255,0.08);
  filter: brightness(1.1) contrast(1.1);
}

/* Fix product image backgrounds in dark mode */
.dark .c-iz {
  background: #0a1a18;
}

.dark .c-bl {
  opacity: 0.4;
}

/* Dark mode fixes for order modal text colors */
.dark .om-tl {
  color: #e5f5f2;
}

.dark .bk-r .bk-v {
  color: #e5f5f2;
}

.dark .qt-l {
  color: rgba(255,255,255,0.4);
}

.dark .qt-v {
  color: #e5f5f2;
}

/* Fix floating cart tooltip in dark mode */
.dark .floating-cart-btn .cart-tooltip {
  background: rgba(0,0,0,0.9);
  border-color: rgba(255,255,255,0.15);
}

.dark .floating-cart-btn .cart-tooltip::after {
  border-left-color: rgba(0,0,0,0.9);
}

/* Mobile Styles */
@media(max-width:640px){
  .grd{grid-template-columns:1fr}
  .hdr{padding:50px 16px 42px}
  .go-top{width:40px;height:40px;bottom:max(env(safe-area-inset-bottom,0px)+88px,88px);right:14px}
  
  /* Smaller cart button on mobile */
  .floating-cart-btn {
    bottom: 100px;
    right: 16px;
    width: 48px;
    height: 48px;
  }
  .floating-cart-btn .cart-icon {
    font-size: 20px;
  }
  .floating-cart-btn .cart-badge {
    min-width: 20px;
    height: 20px;
    font-size: 0.55rem;
    top: -3px;
    right: -3px;
  }
  .floating-cart-btn .cart-tooltip {
    display: none;
  }
  
  .om-wr{padding:12px 8px 32px}
  .om-pn{border-radius:20px}
  .om-bd{padding:14px}
  .om-ft{flex-direction:column;padding:12px 14px 16px}
  .om-cn,.om-wa{width:100%;justify-content:center}
  .lb-bg{padding:56px 12px 72px}
  .lb-arr{width:36px;height:36px}
  .lb-arr-l{left:6px}.lb-arr-r{right:6px}
  .cart-summary-items{max-height:200px}
  .cart-actions {
    flex-direction: column;
  }
  .cart-actions .cart-clear {
    margin-top: 8px;
  }
}
`;

// ═══ MAIN COMPONENT ═══
export default function Omellets() {
  const { t } = useTranslation();
  const [entries, setEntries] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [imgIdx, setImgIdx] = React.useState<Record<string, number>>({});
  
  // 🛒 Cart state
  const [cartItems, setCartItems] = React.useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = React.useState(false);
  const [cartSummaryOpen, setCartSummaryOpen] = React.useState(false);
  
  // Get cart count
  const cartCount = cartItems.reduce((sum, item) => sum + item.cartQuantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => sum + (item["Final Selling Price"] * item.cartQuantity), 0);

  const { isOpen: orderOn, onOpen: openOrd, onOpenChange: togOrd } = useDisclosure();
  const [prod, setProd] = React.useState<Product | null>(null);
  const [form, setForm] = React.useState<OrderForm>(BLANK);

  const [lbOn, setLbOn] = React.useState(false);
  const [lbImgs, setLbImgs] = React.useState<string[]>([]);
  const [lbIdx, setLbIdx] = React.useState(0);

  const [okOn, setOkOn] = React.useState(false);
  const [okId, setOkId] = React.useState("");
  const [topOn, setTopOn] = React.useState(false);

  const pendingRef = React.useRef(false);
  const pendingIdRef = React.useRef("");
  const hiddenRef = React.useRef(false);

  const total = form.price * form.quantity;
  const list = entries.filter(e => Object.values(e).some(v => String(v).toLowerCase().includes(search.toLowerCase())));

  // Load cart from localStorage on mount
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem("omeletts_cart");
      if (saved) setCartItems(JSON.parse(saved));
    } catch (e) {}
  }, []);

  // Save cart to localStorage
  React.useEffect(() => {
    try {
      localStorage.setItem("omeletts_cart", JSON.stringify(cartItems));
    } catch (e) {}
  }, [cartItems]);

  // Cart functions
  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.ID === product.ID);
      if (existing) {
        return prev.map(item => 
          item.ID === product.ID 
            ? { ...item, cartQuantity: item.cartQuantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, cartQuantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.ID !== id));
  };

  const updateCartQty = (id: string, delta: number) => {
    setCartItems(prev => 
      prev.map(item => {
        if (item.ID === id) {
          const newQty = item.cartQuantity + delta;
          if (newQty <= 0) return null;
          return { ...item, cartQuantity: newQty };
        }
        return item;
      }).filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => setCartItems([]);

  const isInCart = (id: string) => cartItems.some(item => item.ID === id);

  // Open cart summary
  const openCartSummary = () => {
    setCartOpen(false);
    setCartSummaryOpen(true);
  };

  // Confirm cart checkout - sends to WhatsApp with details in header
  const confirmCartCheckout = () => {
    if (cartItems.length === 0) return;
    const note = (document.getElementById('cart-note') as HTMLTextAreaElement)?.value || '';
    const now = new Date();
    const dt = now.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    const tm = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    const id = mkId();
    
    // Get details from the first item (assuming all items have similar details)
    const firstItem = cartItems[0];
    const details = [];
    
    if (firstItem.Size) details.push(`Size: ${firstItem.Size}`);
    if (firstItem["Aircraft Type"]) details.push(`Aircraft Type: ${firstItem["Aircraft Type"]}`);
    if (firstItem["Material & Composition"]) details.push(`Material: ${firstItem["Material & Composition"]}`);
    if (firstItem["Age Group"]) details.push(`Age Group: ${firstItem["Age Group"]}`);
    if (firstItem.Origin) details.push(`Origin: ${firstItem.Origin}`);
    if (firstItem.Type && firstItem.Type !== '-') details.push(`Type: ${firstItem.Type}`);
    
    const detailsText = details.length > 0 ? `\n${details.map(d => `  ${d}`).join('\n')}` : '';
    
    // Simple items list - only name, quantity, price
    let items = cartItems.map((item, index) => {
      return `${index + 1}. ${item.Name} x ${item.cartQuantity}\n  ${(item["Final Selling Price"] * item.cartQuantity).toLocaleString()} KIP`;
    }).join('\n');
    
    const msg = `ORDER SUMMARY\n------------------------------\nOrder ID: ${id}\n${dt} | ${tm}\nDetails:${detailsText}\n------------------------------\n\nITEMS:\n${items}\n\n------------------------------\nTOTAL: ${cartTotal.toLocaleString()} KIP\n------------------------------\nPayment: PENDING\n\nThank you for your order!`;
    
    window.open(`https://wa.me/${WA_NUM}?text=${encodeURIComponent(msg)}`, "_blank");
    setCartSummaryOpen(false);
    // Show the "Order Sent" animation
    pendingRef.current = true; pendingIdRef.current = id; hiddenRef.current = false;
    setTimeout(() => {
      if (pendingRef.current && !hiddenRef.current) {
        pendingRef.current = false;
        setOkId(pendingIdRef.current); setOkOn(true);
      }
    }, 1200);
  };

  React.useEffect(() => {
    if (orderOn || lbOn || okOn || cartOpen || cartSummaryOpen) { 
      document.body.style.overflow = "hidden"; 
    } else { 
      document.body.style.overflow = ""; 
    }
    return () => { document.body.style.overflow = ""; };
  }, [orderOn, lbOn, okOn, cartOpen, cartSummaryOpen]);

  React.useEffect(() => { const h = () => setTopOn(window.scrollY > 320); window.addEventListener("scroll", h, { passive: true }); return () => window.removeEventListener("scroll", h); }, []);

  React.useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === "hidden") {
        if (pendingRef.current) hiddenRef.current = true;
      } else if (document.visibilityState === "visible" && pendingRef.current && hiddenRef.current) {
        pendingRef.current = false; hiddenRef.current = false;
        setOkId(pendingIdRef.current); setOkOn(true);
      }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  React.useEffect(() => {
    if (!lbOn) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLbOn(false);
      if (e.key === "ArrowRight") setLbIdx(p => (p + 1) % lbImgs.length);
      if (e.key === "ArrowLeft") setLbIdx(p => (p - 1 + lbImgs.length) % lbImgs.length);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [lbOn, lbImgs.length]);

  React.useEffect(() => {
    fetch(`${API_URL}?t=${Date.now()}`).then(r => r.json()).then(d => {
      if (d.success && Array.isArray(d.products)) setEntries(d.products.map((p: any) => ({
        ID: p.ID || "N/A", Name: p.Name || "N/A", Type: p.Type || "-", Size: p.Size || "-",
        "Qty Bought": Number(p["Qty Bought"]) || 0, "Final Selling Price": Number(p["Final Selling Price"]) || 0,
        Status: p.Status || "", Notes: p.Notes || "", Image: p.Image || "", Phone: p.Phone || "", Logo: p.logo || "",
        Images: p.Images || {}, Rating: Math.min(5, Math.max(0, Number(p.Rating) || 4)),
        "Aircraft Type": p["Aircraft Type"] || "", "Material & Composition": p["Material & Composition"] || "",
        "Assembly Required": p["Assembly Required"] || "", "Age Group": p["Age Group"] || "",
        Origin: p.Origin || "", "Toy Type": p["Toy Type"] || "", "Gender Applicability": p["Gender Applicability"] || "",
      })));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const upd = (p: Partial<OrderForm>) => { setForm(f => ({ ...f, ...p })); };
  const startOrder = (p: Product) => { setProd(p); setForm({ ...BLANK, productId: p.ID, productName: p.Name, price: p["Final Selling Price"] }); openOrd(); };
  const openLb = (imgs: string[], idx: number) => { setLbImgs(imgs); setLbIdx(idx); setLbOn(true); };

  const submit = () => {
    if (!prod) return;
    const id = mkId();
    const now = new Date();
    const dt = now.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    const tm = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    const extra = [["Aircraft Type", prod["Aircraft Type"]], ["Material", prod["Material & Composition"]], ["Age Group", prod["Age Group"]], ["Origin", prod.Origin]].filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join("\n");
    const msg = `Order | ${dt} ${tm}\nID: ${id}\n\n------------------------------\nPRODUCT\n------------------------------\nID: OMS-00-00-${form.productId}\nName: ${form.productName}\nType: ${prod.Type}\nSize: ${prod.Size}\n${extra ? extra + "\n" : ""}Unit: ${form.price.toLocaleString()} KIP\nQty: ${form.quantity}\nTotal: ${total.toLocaleString()} KIP${form.notes ? `\n\nNotes: ${form.notes}` : ""}\n\nPayment: PENDING`;
    window.open(`https://wa.me/${WA_NUM}?text=${encodeURIComponent(msg)}`, "_blank");
    togOrd();
    // Show the "Order Sent" animation
    pendingRef.current = true; pendingIdRef.current = id; hiddenRef.current = false;
    setTimeout(() => {
      if (pendingRef.current && !hiddenRef.current) {
        pendingRef.current = false;
        setOkId(pendingIdRef.current); setOkOn(true);
      }
    }, 1200);
  };

  const ni = (id: string, n: number) => setImgIdx(p => ({ ...p, [id]: ((p[id] ?? 0) + 1) % n }));
  const pi = (id: string, n: number) => setImgIdx(p => ({ ...p, [id]: ((p[id] ?? 0) - 1 + n) % n }));

  return (
    <DefaultLayout>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div className="root pg">
        <div className="hdr">
          <div className="hdr-grid" />
          <div className="hdr-orb" style={{ width: 440, height: 440, top: "-25%", right: "8%", background: "radial-gradient(circle,rgba(13,122,104,.28) 0%,transparent 70%)" }} />
          <div className="hdr-orb" style={{ width: 280, height: 280, bottom: "-35%", left: "4%", background: "radial-gradient(circle,rgba(255,255,255,.05) 0%,transparent 70%)" }} />
          <h1>Omelette<em>'</em>s</h1>
          <p className="hdr-sub">{t("premium_airplane_models") || "Premium Model Aircraft • Collectors & Enthusiasts"}</p>
          <div className="pill"><span className="pill-dot" /> ✈ Collection Store</div>
        </div>
        
        {/* 🛒 Floating Cart Button */}
        <button 
          className={`floating-cart-btn${cartCount > 0 ? ' has-items' : ''}`}
          onClick={() => setCartOpen(true)}
          aria-label="Open cart"
        >
          <AiOutlineShoppingCart className="cart-icon" />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          <span className="cart-tooltip">
            {cartCount > 0 ? `${cartCount} item${cartCount > 1 ? 's' : ''} in favorites` : 'Your favorites'}
          </span>
        </button>

        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px" }}>
          <div className="sw"><div className="si"><div className="sg"><FiSearch size={17} className="s-ico" /><input placeholder={t("search") || "Search airplane models..."} value={search} onChange={e => setSearch(e.target.value)} />{search && <button className="s-clr" onClick={() => setSearch("")}><IoClose size={13} /></button>}</div></div></div>
          <Loading isLoading={loading} fullScreen message="Loading ..." />
          {!loading && !list.length && <div className="emp"><div style={{ fontSize: "2.8rem", marginBottom: 12, opacity: .35 }}>✈</div><p style={{ fontWeight: 700, fontSize: "1rem", marginBottom: 6 }}>{t("no_results_found") || "No results found"}</p><p style={{ fontSize: ".85rem" }}>Try a different search term</p></div>}
          {!loading && list.length > 0 && (
            <>
              <p className="cnt">{list.length} model{list.length !== 1 ? "s" : ""} found</p>
              <div className="grd">
                {list.map((e, i) => {
                  const imgs = getImgs(e); const ci = imgIdx[e.ID] ?? 0; const inCart = isInCart(e.ID);
                  return (
                    <motion.div key={e.ID} className="crd" style={{ animationDelay: `${i * .05}s` }} whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 280, damping: 20 }}>
                      <div className="c-iz">
                        <div className="c-bl" style={{ backgroundImage: `url(${imgs[ci]})` }} />
                        <div className="c-dm" />
                        <LzImg src={imgs[ci]} alt={e.Name} className="c-mi" style={{ position: "relative", zIndex: 2 }} onClick={(ev) => { ev.stopPropagation(); openLb(imgs, ci); }} />
                        {e.Status && <div className="c-bg">{e.Status}</div>}
                        
                        {/* ❤️ Heart Button */}
                        <button 
                          className={`fav-btn${inCart ? " active" : ""}`}
                          onClick={(ev) => { 
                            ev.stopPropagation(); 
                            if (inCart) {
                              removeFromCart(e.ID);
                            } else {
                              addToCart(e);
                            }
                          }}
                          title={inCart ? "Remove from favorites" : "Add to favorites"}
                        >
                          {inCart ? <FaHeart size={15} /> : <FaRegHeart size={15} />}
                        </button>

                        {imgs.length > 1 && (
                          <>
                            <button className="c-nv c-nv-l" onClick={ev => { ev.stopPropagation(); pi(e.ID, imgs.length); }}><AiOutlineLeft size={13} /></button>
                            <button className="c-nv c-nv-r" onClick={ev => { ev.stopPropagation(); ni(e.ID, imgs.length); }}><AiOutlineRight size={13} /></button>
                            <div className="c-ds">{imgs.slice(0, 8).map((_, j) => <button key={j} className={`c-dt${j === ci ? " on" : ""}`} onClick={ev => { ev.stopPropagation(); setImgIdx(p => ({ ...p, [e.ID]: j })); }} />)}</div>
                          </>
                        )}
                      </div>
                      <div className="c-bd">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, flexWrap: "wrap" }}>
                          <h3 className="c-nm">{e.Name}</h3>
                          <AniPrice price={e["Final Selling Price"]} />
                        </div>
                        <div className="c-st">{[...Array(5)].map((_, j) => <FaStar key={j} size={13} style={{ color: j < (e.Rating || 0) ? "#f59e0b" : "rgba(0,0,0,.18)" }} />)}<span className="c-sn">({e.Rating || 0}/5)</span></div>
                        <div className="c-mt">
                          <p>{t("id")}: <span>OMS-00-00-{e.ID}</span></p>
                          <p>{t("type")}: <span>{e.Type}</span></p>
                          <p>{t("size")}: <span>{e.Size}</span></p>
                        </div>
                        <button className="c-bt" onClick={() => startOrder(e)}><AiOutlineShoppingCart size={18} /><span className="hidden sm:inline">{t("shop_now") || "Order Now"}</span></button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </>
          )}
          {!loading && <div style={{ paddingBottom: 44 }} />}
        </div>
      </div>

      {/* 🛒 CART SIDEBAR - Shows LOGO only */}
      <AnimatePresence>
        {cartOpen && (
          <>
            <motion.div 
              className="cart-overlay" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setCartOpen(false)}
            />
            <motion.div 
              className="cart-sidebar"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
            >
              <div className="cart-header">
                <h2><AiOutlineShoppingCart size={20} /> Favorites {cartCount > 0 && `(${cartCount})`}</h2>
                <button className="cart-close" onClick={() => setCartOpen(false)}><IoClose size={18} /></button>
              </div>
              <div className="cart-body">
                {cartItems.length === 0 ? (
                  <div className="cart-empty">
                    <AiOutlineShoppingCart />
                    <p style={{ fontWeight: 600, fontSize: "1rem", marginBottom: 4 }}>No favorites yet</p>
                    <p style={{ fontSize: ".8rem" }}>Click the ❤️ on products you like!</p>
                  </div>
                ) : (
                  cartItems.map(item => {
                    // Use LOGO only in cart
                    const logoUrl = getLogo(item);
                    return (
                      <div key={item.ID} className="cart-item">
                        <img 
                          src={logoUrl} 
                          alt={item.Name} 
                          className="cart-item-img"
                          style={{ objectFit: 'contain' }}
                        />
                        <div className="cart-item-info">
                          <div className="cart-item-name">{item.Name}</div>
                          <div className="cart-item-price">{item["Final Selling Price"].toLocaleString()} ₭</div>
                          <div className="cart-item-qty">
                            <button onClick={() => updateCartQty(item.ID, -1)}><FaMinus size={8} /></button>
                            <span>{item.cartQuantity}</span>
                            <button onClick={() => updateCartQty(item.ID, 1)}><FaPlus size={8} /></button>
                          </div>
                        </div>
                        <button className="cart-item-remove" onClick={() => removeFromCart(item.ID)}>
                          <FaTrash size={14} />
                        </button>
                      </div>
                    );
                  })
                )}
              </div>
              {cartItems.length > 0 && (
                <div className="cart-footer">
                  <div className="cart-total">
                    <span>Total</span>
                    <span>{cartTotal.toLocaleString()} ₭</span>
                  </div>
                  <div className="cart-actions">
                    <button className="cart-checkout" onClick={openCartSummary}>
                      <span className="btn-icon">🛒</span> Order Now
                    </button>
                    <button className="cart-clear" onClick={clearCart}>Clear</button>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 🛒 CART SUMMARY MODAL */}
      <AnimatePresence>
        <CartSummaryModal 
          open={cartSummaryOpen}
          onClose={() => setCartSummaryOpen(false)}
          items={cartItems}
          total={cartTotal}
          onConfirm={confirmCartCheckout}
        />
      </AnimatePresence>

      <AnimatePresence>{topOn && <motion.button className="go-top" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} initial={{ opacity: 0, y: 16, scale: .8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 16, scale: .8 }}><AiOutlineArrowUp size={18} /></motion.button>}</AnimatePresence>

      {/* ═══ LIGHTBOX ═══ */}
      <AnimatePresence>
        {lbOn && lbImgs.length > 0 && (
          <motion.div
            className="lb-bg"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: .2 }}
            onClick={() => setLbOn(false)}
          >
            <div className="lb-top" onClick={e => e.stopPropagation()}>
              {lbImgs.length > 1 ? <div className="lb-cnt">{lbIdx + 1} / {lbImgs.length}</div> : <div />}
              <button className="lb-x" onClick={() => setLbOn(false)}><IoClose size={20} /></button>
            </div>
            <div className="lb-center" onClick={e => e.stopPropagation()}>
              <img key={lbIdx} className="lb-img" src={lbImgs[lbIdx]} alt={`Image ${lbIdx + 1}`} />
            </div>
            {lbImgs.length > 1 && (
              <>
                <button className="lb-arr lb-arr-l" onClick={e => { e.stopPropagation(); setLbIdx(p => (p - 1 + lbImgs.length) % lbImgs.length); }}><AiOutlineLeft size={20} /></button>
                <button className="lb-arr lb-arr-r" onClick={e => { e.stopPropagation(); setLbIdx(p => (p + 1) % lbImgs.length); }}><AiOutlineRight size={20} /></button>
              </>
            )}
            {lbImgs.length > 1 && (
              <div className="lb-bot" onClick={e => e.stopPropagation()}>
                <div className="lb-ths">
                  {lbImgs.map((src, i) => (
                    <img key={i} src={src} className={`lb-th${i === lbIdx ? " on" : ""}`} onClick={() => setLbIdx(i)} alt="" />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ ORDER MODAL ═══ */}
      <AnimatePresence>
        {orderOn && prod && (
          <motion.div className="om-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={togOrd}>
            <div className="om-orb" style={{ width: 440, height: 440, top: "-15%", left: "-8%", background: "radial-gradient(circle,rgba(13,122,104,.25) 0%,transparent 60%)", filter: "blur(50px)" }} />
            <div className="om-orb" style={{ width: 340, height: 340, bottom: "-15%", right: "-5%", background: "radial-gradient(circle,rgba(77,184,168,.2) 0%,transparent 60%)", filter: "blur(44px)" }} />
            <div className="om-wr">
              <motion.div className="om-pn" onClick={e => e.stopPropagation()} initial={{ opacity: 0, y: 24, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 24, scale: .96 }} transition={{ duration: .25, ease: [.22, 1, .36, 1] }}>
                <button className="om-cl" onClick={togOrd}><IoClose size={14} /></button>
                <div className="om-hd"><div className="om-tl"><div className="om-ic"><IoAirplane size={14} /></div><span>Confirm Your Order</span></div></div>
                <div className="om-bd">
                  <div className="bk">
                    <div className="bk-t"><div className="bk-i"><FaBox size={10} /></div> Product Details</div>
                    {([["ID", `OMS-00-00-${prod.ID}`], ["Name", prod.Name], ["Type", prod.Type], ["Size", prod.Size], ...(prod["Aircraft Type"] ? [["Aircraft Type", prod["Aircraft Type"]]] : []), ...(prod["Material & Composition"] ? [["Material", prod["Material & Composition"]]] : []), ...(prod["Age Group"] ? [["Age Group", prod["Age Group"]]] : []), ...(prod.Origin ? [["Origin", prod.Origin]] : [])] as [string, string][]).map(([k, v], i) => <div key={i} className="bk-r"><span>{k}</span><span className="bk-v">{v}</span></div>)}
                    <div className="bk-hr" />
                    <div className="bk-r"><span>Unit Price</span><span className="bk-v" style={{ color: "#E43636", fontWeight: 800 }}>{prod["Final Selling Price"].toLocaleString()} ₭</span></div>
                  </div>
                  <div className="qt"><span className="qt-l">Quantity</span><div className="qt-c"><button className="qt-b" onClick={() => form.quantity > 1 && upd({ quantity: form.quantity - 1 })}><FaMinus size={11} /></button><span className="qt-v">{form.quantity}</span><button className="qt-b" onClick={() => upd({ quantity: form.quantity + 1 })}><FaPlus size={11} /></button></div></div>
                  <div className="bk">
                    <div className="bk-t"><div className=""><FaRegNoteSticky size={15} /></div> Anything Else?</div>
                    <div className="fw"><textarea className="fta" placeholder="Add a note for us — color preference, gift message, special request… (optional)" value={form.notes} rows={2} onChange={e => upd({ notes: e.target.value })} /></div>
                  </div>
                  <div className="tot"><span className="tot-l">Total Amount</span><span className="tot-v">{total.toLocaleString()} ₭</span></div>
                </div>
                <div className="om-ft"><button className="om-cn" onClick={togOrd}>Cancel</button><button className="om-wa" onClick={submit}><FaWhatsapp size={16} /> Send to WhatsApp</button></div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence><OkModal open={okOn} close={() => setOkOn(false)} id={okId} /></AnimatePresence>
    </DefaultLayout>
  );
}