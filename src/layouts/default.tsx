import { Link } from "@heroui/link";
import { useEffect, useState } from "react";
import { 
  FaTruck,
  FaLock,
  FaUndo,
  FaWhatsapp,
  FaEnvelope
} from "react-icons/fa";
import { RiCustomerService2Fill } from "react-icons/ri";

import { Navbar } from "@/components/navbar";
import Loading from "@/components/loading";
import { MobileFooter } from "@/components/MobileFooter";
import { FaHandshakeAngle, FaHandshakeSimple } from "react-icons/fa6";

/* ─────────────────────────────────────────────────────────
   Modern Premium Footer CSS
───────────────────────────────────────────────────────── */
const layoutCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700&display=swap');

  :root {
    --navbar-h: 64px;
    --mobile-navbar-h: 56px;
    --mobile-footer-h: 64px;
    --primary-green: #0a6455;
    --primary-green-light: #0e7f6c;
    --primary-green-dark: #074d41;
  }

  html, body {
    overflow-x: hidden;
    max-width: 100vw;
    background-color: #050e0c;
  }
  html.light body {
    background-color: #fafafa;
  }

  .mobile-content-wrap { padding-bottom: 0; }

  /* ══════════════════════════════════════════
     MODERN PREMIUM FOOTER
  ══════════════════════════════════════════ */
  
  .modern-footer {
    background: linear-gradient(135deg, #0a0f0e 0%, #0b1512 100%);
    position: relative;
    font-family: 'Inter', sans-serif;
    margin-top: 80px;
  }
  
  html.light .modern-footer {
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  }
  
  /* Decorative top accent - green only */
  .footer-accent {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--primary-green), var(--primary-green-light), var(--primary-green));
  }
  
  /* Main container */
  .footer-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 64px 48px 0;
  }
  
  /* Main footer grid */
  .footer-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1.2fr;
    gap: 48px;
    margin-bottom: 48px;
  }
  
  /* Brand column - centered logo only */
  .brand-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
  }
  
  .logo-row {
    display: flex;
    justify-content: center;
    width: 100%;
  }
  
  .footer-logo-dark,
  .footer-logo-light {
    width: 180px;
    height: 180px;
    object-fit: contain;
  }
  
  .footer-logo-dark { display: block; }
  .footer-logo-light { display: none; }
  html.light .footer-logo-dark { display: none; }
  html.light .footer-logo-light { display: block; }
  
  /* Column styling */
  .footer-col h4 {
    color: #fff;
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0 20px 0;
    letter-spacing: -0.01em;
    position: relative;
    display: inline-block;
    transition: all 0.3s ease;
  }
  
  .footer-col h4::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 0;
    height: 2px;
    background: var(--primary-green-light);
    transition: width 0.3s ease;
  }
  
  .footer-col:hover h4::after {
    width: 100%;
  }
  
  html.light .footer-col h4 {
    color: #1a1a1a;
  }
  
  .footer-links {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .footer-links a {
    color: rgba(255,255,255,0.5);
    text-decoration: none;
    font-size: 0.9rem;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    display: inline-block;
    position: relative;
  }
  
  .footer-links a::before {
    content: '→';
    position: absolute;
    left: -20px;
    opacity: 0;
    transition: all 0.3s ease;
    color: var(--primary-green-light);
  }
  
  .footer-links a:hover {
    color: var(--primary-green-light);
    transform: translateX(8px);
    padding-left: 8px;
  }
  
  .footer-links a:hover::before {
    opacity: 1;
    left: -8px;
  }
  
  html.light .footer-links a {
    color: rgba(0,0,0,0.5);
  }
  
  html.light .footer-links a:hover {
    color: var(--primary-green);
  }
  
  /* Contact info */
  .contact-info {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .contact-item {
    display: flex;
    align-items: center;
    gap: 12px;
    color: rgba(255,255,255,0.5);
    font-size: 0.9rem;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  
  .contact-item:hover {
    transform: translateX(8px);
    color: rgba(255,255,255,0.8);
  }
  
  html.light .contact-item {
    color: rgba(0,0,0,0.5);
  }
  
  html.light .contact-item:hover {
    color: rgba(0,0,0,0.8);
  }
  
  .contact-icon {
    font-size: 1.2rem;
    color: var(--primary-green-light);
    transition: all 0.3s ease;
  }
  
  .contact-item:hover .contact-icon {
    transform: scale(1.2) rotate(5deg);
  }
  
  .whatsapp-link {
    color: rgba(255,255,255,0.5);
    text-decoration: none;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    display: inline-flex;
    align-items: center;
    gap: 12px;
  }
  
  .whatsapp-link:hover {
    color: #25D366;
    transform: translateX(8px);
  }
  
  .whatsapp-link:hover .contact-icon {
    transform: scale(1.2) rotate(5deg);
  }
  
  .email-link {
    color: rgba(255,255,255,0.5);
    text-decoration: none;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    display: inline-flex;
    align-items: center;
    gap: 12px;
  }
  
  .email-link:hover {
    color: var(--primary-green-light);
    transform: translateX(8px);
  }
  
  .email-link:hover .contact-icon {
    transform: scale(1.2) rotate(5deg);
  }
  
  html.light .whatsapp-link,
  html.light .email-link {
    color: rgba(0,0,0,0.5);
  }
  
  /* Trust badges section */
  .trust-badges {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    padding: 40px 0;
    border-top: 1px solid rgba(255,255,255,0.08);
    border-bottom: 1px solid rgba(255,255,255,0.08);
    margin-bottom: 32px;
  }
  
  html.light .trust-badges {
    border-color: rgba(0,0,0,0.08);
  }
  
  .trust-item {
    display: flex;
    align-items: center;
    gap: 14px;
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    cursor: pointer;
  }
  
  .trust-item:hover {
    transform: translateY(-6px);
  }
  
  .trust-icon {
    font-size: 2rem;
    color: var(--primary-green-light);
    transition: all 0.3s ease;
  }
  
  .trust-item:hover .trust-icon {
    transform: scale(1.15) rotate(3deg);
  }
  
  .trust-text {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  .trust-title {
    color: #fff;
    font-weight: 600;
    font-size: 0.9rem;
    transition: all 0.3s ease;
  }
  
  .trust-item:hover .trust-title {
    color: var(--primary-green-light);
    transform: translateX(4px);
  }
  
  html.light .trust-title {
    color: #1a1a1a;
  }
  
  html.light .trust-item:hover .trust-title {
    color: var(--primary-green);
  }
  
  .trust-sub {
    color: rgba(255,255,255,0.5);
    font-size: 0.75rem;
    transition: all 0.3s ease;
  }
  
  .trust-item:hover .trust-sub {
    transform: translateX(4px);
  }
  
  html.light .trust-sub {
    color: rgba(0,0,0,0.5);
  }
  
  /* Bottom bar */
  .footer-bottom {
    padding: 24px 0 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
  }
  
  .copyright {
    color: rgba(255,255,255,0.4);
    font-size: 0.85rem;
    transition: all 0.3s ease;
  }
  
  .copyright:hover {
    color: rgba(255,255,255,0.6);
    transform: translateX(4px);
  }
  
  html.light .copyright {
    color: rgba(0,0,0,0.4);
  }
  
  html.light .copyright:hover {
    color: rgba(0,0,0,0.6);
  }
  
  .partner-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    background: rgba(10,100,85,0.1);
    border-radius: 20px;
    font-size: 0.85rem;
    color: rgba(255,255,255,0.6);
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  
  .partner-badge:hover {
    transform: translateY(-2px);
    background: rgba(10,100,85,0.2);
    box-shadow: 0 4px 12px rgba(10,100,85,0.2);
  }
  
  html.light .partner-badge {
    color: rgba(0,0,0,0.6);
  }
  
  .partner-badge a {
    color: var(--primary-green-light);
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
  }
  
  .partner-badge a:hover {
    text-decoration: underline;
    transform: translateX(2px);
    display: inline-block;
  }
  
  /* Responsive */
  @media (max-width: 1024px) {
    .footer-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 40px;
    }
    
    .trust-badges {
      grid-template-columns: repeat(2, 1fr);
    }
    
    .footer-logo-dark,
    .footer-logo-light {
      width: 140px;
      height: 140px;
    }
  }
  
  @media (max-width: 768px) {
    .footer-container {
      padding: 40px 24px 0;
    }
    
    .footer-grid {
      grid-template-columns: 1fr;
      gap: 32px;
    }
    
    .trust-badges {
      grid-template-columns: 1fr;
    }
    
    .footer-bottom {
      flex-direction: column;
      text-align: center;
    }
    
    .footer-logo-dark,
    .footer-logo-light {
      width: 120px;
      height: 120px;
    }
    
    .brand-col {
      align-items: center;
    }
  }
`;

/* Logo URLs - Updated */
const LOGO_DARK = "https://res.cloudinary.com/deahgtn57/image/upload/v1781425952/omelett%27s/public/logo/web-app%20logo/white-2026.png";
const LOGO_LIGHT = "https://res.cloudinary.com/deahgtn57/image/upload/v1781425959/omelett%27s/public/logo/web-app%20logo/dark-2026.png";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const alreadyVisited = sessionStorage.getItem("hasVisited");
    if (!alreadyVisited) {
      const timeout = setTimeout(() => {
        setIsLoading(false);
        sessionStorage.setItem("hasVisited", "true");
      }, 1500);
      return () => clearTimeout(timeout);
    } else {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="relative flex flex-col min-h-screen">
      <style dangerouslySetInnerHTML={{ __html: layoutCSS }} />

      <Navbar />

      <main
        className="flex-grow w-full"
        style={{ paddingTop: "var(--navbar-h)" }}
      >
        <div className="mobile-content-wrap">
          {isLoading ? <Loading /> : children}
        </div>
      </main>

      <MobileFooter />

      {/* Modern Premium Footer */}
      <footer className="modern-footer hidden lg:block">
        <div className="footer-accent" />
        
        <div className="footer-container">
          {/* Main Footer Grid */}
          <div className="footer-grid">
            {/* Brand Column - Just Logo (No Animation) */}
            <div className="brand-col">
              <div className="logo-row">
                <img src={LOGO_DARK} alt="Omelette's logo" className="footer-logo-dark" />
                <img src={LOGO_LIGHT} alt="Omelette's logo" className="footer-logo-light" />
              </div>
            </div>

            {/* Quick Links */}
            <div className="footer-col">
              <h4>Shop</h4>
              <ul className="footer-links">
                <li><Link href="/Omelette's">Collection</Link></li>
                <li><Link href="/Omelette's">New Arrivals</Link></li>
                <li><Link href="/Omelette's">Best Sellers</Link></li>
                <li><Link href="/Omelette's">Limited Edition</Link></li>
                <li><Link href="/Omelette's">Gift Sets</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Support</h4>
              <ul className="footer-links">
                <li><Link href="/about">About Us</Link></li>
                <li><Link href="/help">FAQ</Link></li>
                <li><Link href="/help">Shipping Info</Link></li>
                <li><Link href="/help">Returns & Exchanges</Link></li>
                <li><Link href="/help">Contact Us</Link></li>
              </ul>
            </div>

            {/* Contact Column */}
            <div className="footer-col">
              <h4>Connect With Us</h4>
              <div className="contact-info">
                <a href="https://mail.google.com/mail/?view=cm&fs=1&to=omelettes.hub@gmail.com" target="_blank" rel="noopener noreferrer" className="email-link">
                  <FaEnvelope className="contact-icon" />
                  <span>omelettes.hub@gmail.com</span>
                </a>
                <a href="https://wa.me/8562055058028" target="_blank" rel="noopener noreferrer" className="whatsapp-link">
                  <FaWhatsapp className="contact-icon" />
                  <span>+856 20 5505 8028</span>
                </a>
                <div className="contact-item">
                  <RiCustomerService2Fill className="contact-icon" />
                  <span>24/7 Customer Support</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="trust-badges">
            <div className="trust-item">
              <FaLock className="trust-icon" />
              <div className="trust-text">
                <span className="trust-title">Secure Shopping</span>
                <span className="trust-sub">256-bit SSL Encryption</span>
              </div>
            </div>
            <div className="trust-item">
              <FaTruck className="trust-icon" />
              <div className="trust-text">
                <span className="trust-title">Free Shipping</span>
                <span className="trust-sub">On orders over $100</span>
              </div>
            </div>
            <div className="trust-item">
              <FaUndo className="trust-icon" />
              <div className="trust-text">
                <span className="trust-title">Easy Returns</span>
                <span className="trust-sub">Hassle-free returns</span>
              </div>
            </div>
            <div className="trust-item">
             <FaHandshakeAngle className="trust-icon" />
              <div className="trust-text">
                <span className="trust-title">Partner With Us</span>
                <span className="trust-sub">Become an affiliate partner →</span>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="footer-bottom">
            <div className="copyright">
              © 2023–2026 Omelette's Premium Collectibles. All rights reserved.
            </div>
            <div className="partner-badge">
              <span> Want to partner? Contact us at</span>
              <a href="https://mail.google.com/mail/?view=cm&fs=1&to=omelettes.hub@gmail.com" target="_blank" rel="noopener noreferrer">
                omelettes.hub@gmail.com
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}