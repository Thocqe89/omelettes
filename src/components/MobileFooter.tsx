import { useEffect, useState } from "react";
import { Link } from "@heroui/link";
import { useTranslation } from "react-i18next";
import {
  AiOutlineHome,
  AiOutlineInfoCircle,
  AiOutlineShopping,
  AiOutlineUser,
} from "react-icons/ai";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Ubuntu:wght@400;500;700&display=swap');

  .mf-bar {
    position: fixed;
    bottom: max(env(safe-area-inset-bottom, 0px) + 12px, 12px);
    left: 50%;
    transform: translateX(-50%);
    z-index: 9999;
    width: calc(100% - 32px);
    max-width: 420px;
    padding: 8px 6px;
    border-radius: 28px;
    /* iOS frosted glass — transparent but with strong blur */
    background: rgba(255, 255, 255, 0.55);
    backdrop-filter: blur(50px) saturate(2.2) brightness(1.15);
    -webkit-backdrop-filter: blur(50px) saturate(2.2) brightness(1.15);
    border: 0.5px solid rgba(255, 255, 255, 0.6);
    box-shadow:
      0 1px 3px rgba(0,0,0,.04),
      0 8px 24px rgba(0,0,0,.08),
      0 0 0 0.5px rgba(0,0,0,.03),
      0 1px 0 rgba(255,255,255,.85) inset;
    display: flex;
    justify-content: space-around;
    align-items: center;
    font-family: 'Ubuntu', sans-serif;
  }

  /* Top highlight — iOS style */
  .mf-bar::before {
    content: '';
    position: absolute;
    top: 0; left: 12%; right: 12%; height: 0.5px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.9) 50%, transparent);
    border-radius: 28px;
    pointer-events: none;
  }

  /* Inner light layer to ensure readability on dark bg */
  .mf-bar::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 28px;
    background: linear-gradient(180deg, rgba(255,255,255,.18) 0%, rgba(255,255,255,.05) 100%);
    pointer-events: none;
    z-index: -1;
  }

  /* ── Dark mode ── */
  .dark .mf-bar {
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
  .dark .mf-bar::before {
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.06) 50%, transparent);
  }
  .dark .mf-bar::after {
    background: linear-gradient(180deg, rgba(255,255,255,.04) 0%, transparent 100%);
  }

  @media (min-width: 1024px) {
    .mf-bar { display: none !important; }
  }

  /* ── Items ── */
  .mf-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    padding: 7px 4px 6px;
    border-radius: 20px;
    text-decoration: none;
    cursor: pointer;
    position: relative;
    transition: transform 0.18s cubic-bezier(.34,1.56,.64,1);
    -webkit-tap-highlight-color: transparent;
  }
  .mf-item:active { transform: scale(0.9); }

  .mf-item.active {
    background: rgba(13, 122, 104, 0.1);
  }
  .dark .mf-item.active {
    background: rgba(13, 122, 104, 0.22);
  }

  .mf-icon-wrap {
    width: 40px; height: 28px;
    display: flex; align-items: center; justify-content: center;
    border-radius: 12px;
    transition: background 0.2s, transform 0.22s cubic-bezier(.34,1.56,.64,1);
  }
  .mf-item.active .mf-icon-wrap {
    background: rgba(13, 122, 104, .12);
    transform: translateY(-2px) scale(1.06);
  }
  .dark .mf-item.active .mf-icon-wrap {
    background: rgba(77, 184, 168, .18);
  }

  .mf-icon {
    display: flex;
    transition: color 0.2s;
    color: rgba(0, 0, 0, 0.4);
  }
  .mf-item.active .mf-icon { color: #0d7a68; }
  .dark .mf-icon { color: rgba(255, 255, 255, 0.4); }
  .dark .mf-item.active .mf-icon { color: #4db8a8; }

  .mf-label {
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.15px;
    line-height: 1;
    color: rgba(0, 0, 0, 0.4);
    transition: color 0.2s, font-weight 0.15s;
  }
  .mf-item.active .mf-label {
    color: #0d7a68;
    font-weight: 700;
  }
  .dark .mf-label { color: rgba(255, 255, 255, 0.35); }
  .dark .mf-item.active .mf-label { color: #4db8a8; font-weight: 700; }
`;

export const MobileFooter = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("home");

  useEffect(() => {
    const path = window.location.pathname;
    if (path === "/")                        setActiveTab("home");
    else if (path.startsWith("/oms-store")) setActiveTab("store");
    else if (path.startsWith("/about"))      setActiveTab("about_us");
    else if (path.startsWith("/help"))       setActiveTab("help");
    else                                     setActiveTab("");
  }, []);

  const nav = [
    { tab: "home",     href: "/",            icon: <AiOutlineHome size={22} />,       label: t("home")     },
    { tab: "store",    href: "/oms-store",  icon: <AiOutlineShopping size={22} />,   label: t("store")    },
    { tab: "about_us", href: "/about",       icon: <AiOutlineInfoCircle size={22} />, label: t("about_us") },
    { tab: "help",     href: "/help",        icon: <AiOutlineUser size={22} />,       label: t("help")     },
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <nav className="lg:hidden mf-bar">
        {nav.map(({ tab, href, icon, label }) => (
          <Link
            key={tab}
            href={href}
            className={`mf-item${activeTab === tab ? " active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            <span className="mf-icon-wrap">
              <span className="mf-icon">{icon}</span>
            </span>
            <span className="mf-label">{label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
};