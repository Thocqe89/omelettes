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

  /* ── iOS floating pill ── */
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

    /* iOS frosted glass */
    background: rgba(255, 255, 255, 0.22);
    backdrop-filter: blur(40px) saturate(2) brightness(1.1);
    -webkit-backdrop-filter: blur(40px) saturate(2) brightness(1.1);
    border: 1px solid rgba(255, 255, 255, 0.4);
    box-shadow:
      0 2px 8px rgba(0,0,0,.06),
      0 8px 28px rgba(0,0,0,.13),
      0 1px 0 rgba(255,255,255,.7) inset;

    display: flex;
    justify-content: space-around;
    align-items: center;
    font-family: 'Ubuntu', sans-serif;
  }

  /* top gloss */
  .mf-bar::before {
    content: '';
    position: absolute;
    top: 0; left: 15%; right: 15%; height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.9) 50%, transparent);
    border-radius: 28px;
    pointer-events: none;
  }

  /* dark mode */
  .dark .mf-bar {
    background: rgba(10, 20, 18, 0.45);
    border-color: rgba(255,255,255,0.1);
    box-shadow:
      0 4px 8px rgba(0,0,0,.25),
      0 12px 36px rgba(0,0,0,.4),
      0 1px 0 rgba(255,255,255,.07) inset;
  }
  .dark .mf-bar::before {
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.1) 50%, transparent);
  }

  /* hide on desktop */
  @media (min-width: 1024px) {
    .mf-bar { display: none !important; }
  }

  /* ── each item ── */
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

  /* active background chip */
  .mf-item.active {
    background: rgba(13,122,104,0.12);
  }
  .dark .mf-item.active {
    background: rgba(13,122,104,0.28);
  }

  /* icon lozenge */
  .mf-icon-wrap {
    width: 40px; height: 28px;
    display: flex; align-items: center; justify-content: center;
    border-radius: 12px;
    transition: background 0.2s, transform 0.22s cubic-bezier(.34,1.56,.64,1);
  }
  .mf-item.active .mf-icon-wrap {
    background: rgba(13,122,104,.15);
    transform: translateY(-2px) scale(1.06);
  }
  .dark .mf-item.active .mf-icon-wrap {
    background: rgba(77,184,168,.2);
  }

  /* icon */
  .mf-icon {
    display: flex;
    transition: color 0.2s;
    color: rgba(80, 100, 95, 0.6);
  }
  .mf-item.active .mf-icon { color: #0d7a68; }
  .dark .mf-icon             { color: rgba(255,255,255,0.35); }
  .dark .mf-item.active .mf-icon { color: #4db8a8; }

  /* label */
  .mf-label {
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.15px;
    line-height: 1;
    color: rgba(80,100,95,0.6);
    transition: color 0.2s, font-weight 0.15s;
  }
  .mf-item.active .mf-label {
    color: #0d7a68;
    font-weight: 700;
  }
  .dark .mf-label                 { color: rgba(255,255,255,0.32); }
  .dark .mf-item.active .mf-label { color: #4db8a8; }
`;

export const MobileFooter = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("home");

  useEffect(() => {
    const path = window.location.pathname;
    if (path === "/")                        setActiveTab("home");
    else if (path.startsWith("/Omelette's")) setActiveTab("store");
    else if (path.startsWith("/about"))      setActiveTab("about_us");
    else if (path.startsWith("/help"))       setActiveTab("help");
    else                                     setActiveTab("");
  }, []);

  const nav = [
    { tab: "home",     href: "/",            icon: <AiOutlineHome size={22} />,        label: t("home")     },
    { tab: "store",    href: "/Omelette's",  icon: <AiOutlineShopping size={22} />,    label: t("store")    },
    { tab: "about_us", href: "/about",       icon: <AiOutlineInfoCircle size={22} />,  label: t("about_us") },
    { tab: "help",     href: "/help",        icon: <AiOutlineUser size={22} />,        label: t("help")     },
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