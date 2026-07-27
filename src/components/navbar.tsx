import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { 
  AiOutlineUser, 
  AiOutlineShopping, 
  AiOutlineHome, 
  AiOutlineInfoCircle, 
  AiOutlineClose, 
  AiOutlineMenu,
  AiOutlineIdcard,
  AiFillSignature
} from "react-icons/ai";
import { useTranslation } from "react-i18next";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
} from "@heroui/navbar";
import clsx from "clsx";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Tooltip } from "@heroui/tooltip";
import { Image } from "@heroui/image";

import { ThemeSwitch } from "@/components/theme-switch";
import { siteConfig } from "@/config/site";
import React from "react";

export const Navbar = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const [language, setLanguage] = useState(i18n.language || "en");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeNav, setActiveNav] = useState("");
  const [storeWiggle, setStoreWiggle] = useState(false);

  const isOnStorePage = location.pathname.startsWith("/oms-store");

  useEffect(() => {
    setLanguage(i18n.language);
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage && savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage);
    }

    const path = location.pathname;
    if (path === "/") setActiveNav("home");
    else if (path.startsWith("/about")) setActiveNav("about_us");
    else if (path.startsWith("/oms-store")) setActiveNav("store");
    else if (path.startsWith("/help")) setActiveNav("help");
    else setActiveNav("");

    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [i18n, location]);

  useEffect(() => {
    setLanguage(i18n.language);
  }, [i18n.language]);

  useEffect(() => {
    const path = location.pathname;
    if (path === "/") setActiveNav("home");
    else if (path.startsWith("/about")) setActiveNav("about_us");
    else if (path.startsWith("/oms-store")) {
      setActiveNav("store");
      setStoreWiggle(false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setStoreWiggle(true);
          setTimeout(() => setStoreWiggle(false), 700);
        });
      });
    }
    else if (path.startsWith("/help")) setActiveNav("help");
    else setActiveNav("");
  }, [location]);

  const handleLanguageChange = async (langCode: string) => {
    try {
      localStorage.setItem("language", langCode);
      await i18n.changeLanguage(langCode);
      setLanguage(langCode);
      if (isMenuOpen) setIsMenuOpen(false);
      setTimeout(() => window.location.reload(), 100);
    } catch (error) {
      console.error("Error changing language:", error);
    }
  };

  const languages = [
    { code: "en", name: "English", flag: "https://res.cloudinary.com/deahgtn57/image/upload/v1757089546/omelett%27s/public/logo/flage/united-kingdom_uwbrwr.png" },
    { code: "la", name: "ລາວ", flag: "https://res.cloudinary.com/deahgtn57/image/upload/v1757089414/omelett%27s/public/logo/flage/laos_dewgms.png" },
    { code: "zh", name: "中文", flag: "https://res.cloudinary.com/deahgtn57/image/upload/v1757089559/omelett%27s/public/logo/flage/china_wdpui0.png" },
    { code: "th", name: "ไทย", flag: "https://res.cloudinary.com/deahgtn57/image/upload/v1757089545/omelett%27s/public/logo/flage/thailand_vfbs1y.png" }
  ];

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  const navItems = [
    { href: "/", label: "home", icon: <AiOutlineHome /> },
    { href: "/about", label: "about_us", icon: <AiOutlineInfoCircle /> },
    { href: "/help", label: "help", icon: <AiOutlineIdcard /> },
    { href: "/oms-store", label: "store", icon: <AiOutlineShopping /> },
  ];

  const tabletNavItems = navItems.slice(0, 3);

  // Store icon component with all animation states
  const StoreIconWrap = () => (
    <span className="store-icon-wrap">
      <span
        className={clsx(
          "store-icon-inner",
          !isOnStorePage && !storeWiggle && "store-bounce-color",
          storeWiggle && "store-wiggle"
        )}
      >
        <AiOutlineShopping />
      </span>
    </span>
  );

  return (
    <>
      <style>{`
        .navbar-wrapper {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
        }

        main { padding-top: 64px; }
        .content-after-navbar { margin-top: 64px; }

        @media (max-width: 768px) {
          main { padding-top: 64px; }
          .content-after-navbar { margin-top: 64px; }
        }

        /* ===== Store icon wrapper ===== */
        .store-icon-wrap {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .store-icon-inner {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transform-origin: center bottom;
        }

        /* ===== Bounce + Green→Teal color cycle (away from store) ===== */
        @keyframes storeBounceColor {
          0% {
            transform: translateY(0px);
            color: #0d7a68;
            filter: drop-shadow(0 0 3px rgba(13, 122, 104, 0.4));
          }
          20% {
            transform: translateY(-5px);
            color: #22c55e;
            filter: drop-shadow(0 4px 6px rgba(34, 197, 94, 0.5));
          }
          40% {
            transform: translateY(0px);
            color: #0d9488;
            filter: drop-shadow(0 0 4px rgba(13, 148, 136, 0.45));
          }
          60% {
            transform: translateY(-2.5px);
            color: #10b981;
            filter: drop-shadow(0 3px 5px rgba(16, 185, 129, 0.4));
          }
          80% {
            transform: translateY(0px);
            color: #059669;
            filter: drop-shadow(0 0 3px rgba(5, 150, 105, 0.35));
          }
          100% {
            transform: translateY(0px);
            color: #0d7a68;
            filter: drop-shadow(0 0 3px rgba(13, 122, 104, 0.4));
          }
        }

        .store-bounce-color {
          animation: storeBounceColor 2.4s ease-in-out infinite;
        }

        /* ===== Wiggle once on landing ===== */
        @keyframes storeWiggle {
          0%   { transform: rotate(0deg) scale(1);    color: #0d7a68; }
          15%  { transform: rotate(-18deg) scale(1.2); color: #22c55e; }
          30%  { transform: rotate(16deg) scale(1.15); color: #0d9488; }
          45%  { transform: rotate(-12deg) scale(1.05); color: #10b981; }
          60%  { transform: rotate(8deg) scale(1.05);  color: #059669; }
          75%  { transform: rotate(-4deg) scale(1);    color: #0d9488; }
          90%  { transform: rotate(2deg) scale(1);     color: #0d7a68; }
          100% { transform: rotate(0deg) scale(1);     color: #0d7a68; }
        }

        .store-wiggle {
          animation: storeWiggle 0.7s ease-in-out forwards;
        }
      `}</style>

      <div className="navbar-wrapper">
        <HeroUINavbar
          className={`w-full transition-all duration-300 m-0 p-0 ${
            scrolled
              ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b border-gray-200 dark:border-gray-800"
              : "bg-white dark:bg-gray-900 shadow-sm"
          }`}
          isBlurred={false}
          maxWidth="full"
          isMenuOpen={isMenuOpen}
          onMenuOpenChange={setIsMenuOpen}
          height="64px"
        >
          {/* Left: Brand Logo */}
        {/* Left: Brand Logo */}
<NavbarContent justify="start" className="p-0 m-0">
  <NavbarBrand className="gap-3 m-0 p-0">
    {/* Light mode logo */}
    <Image
      isBlurred
      alt="Omelette's logo"
      src="https://res.cloudinary.com/deahgtn57/image/upload/v1781425959/omelett%27s/public/logo/web-app%20logo/dark-2026.png"
      width={50}
      height={50}
      className="rounded-lg shadow-sm block dark:hidden"
    />
    {/* Dark mode logo */}
    <Image
      isBlurred
      alt="Omelette's logo"
      src="https://res.cloudinary.com/deahgtn57/image/upload/v1781425952/omelett%27s/public/logo/web-app%20logo/white-2026.png"
      width={50}
      height={50}
      className="rounded-lg shadow-sm hidden dark:block"
    />
    <div className="hidden md:block">
      <h1 className="text-lg lg:text-xl font-bold text-[#0d7a68]">
        Omelette<span className="text-[#E43636]">'</span>s
      </h1>
      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('oms')}</span>
    </div>
  </NavbarBrand>
</NavbarContent>

          {/* ====== TABLET VIEW (768px-1024px) ====== */}
          <NavbarContent className="hidden md:flex lg:hidden gap-1" justify="center">
            {tabletNavItems.map((item) => (
              <NavbarItem key={item.href}>
                <Link
                  className={clsx(
                    "flex flex-col items-center font-medium transition-colors duration-200",
                    "px-2 py-2 rounded-lg",
                    activeNav === item.label
                      ? "text-[#0d7a68] bg-[#0d7a68]/10"
                      : "text-gray-700 dark:text-gray-300 hover:text-[#0d7a68] hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                  to={item.href}
                  onClick={() => { setActiveNav(item.label); window.scrollTo(0, 0); }}
                >
                  <span className="text-lg mb-1">
                    {item.label === "store" ? <StoreIconWrap /> : item.icon}
                  </span>
                  <span className="text-xs">{t(item.label)}</span>
                </Link>
              </NavbarItem>
            ))}
          </NavbarContent>

          {/* ====== TABLET RIGHT SIDE ====== */}
          <NavbarContent className="hidden md:flex lg:hidden gap-1" justify="end">
            <NavbarItem>
              <Dropdown backdrop="blur">
                <DropdownTrigger>
                  <Button isIconOnly variant="light" size="sm" className="min-w-[40px] h-[40px]">
                    <Image isBlurred alt="Language Flag" className="w-5 h-5 rounded-full" src={currentLanguage.flag} width={20} height={20} />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Language Selection" variant="flat"
                  selectionMode="single" selectedKeys={[currentLanguage.code]}
                  onAction={(key) => handleLanguageChange(key as string)}
                >
                  {languages.map((lang) => (
                    <DropdownItem key={lang.code} className={clsx("flex items-center gap-3", language === lang.code && "bg-[#0d7a68]/10 text-[#0d7a68]")}>
                      <Image alt={`${lang.name} Flag`} className="w-5 h-5 rounded" src={lang.flag} width={20} height={20} />
                      <span>{lang.name}</span>
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </NavbarItem>
            <NavbarItem><ThemeSwitch /></NavbarItem>
            <NavbarItem>
              <NavbarMenuToggle
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                icon={isMenuOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
                className="text-gray-700 dark:text-gray-300 hover:text-[#0d7a68]"
              />
            </NavbarItem>
          </NavbarContent>

          {/* ====== DESKTOP VIEW (1024px and above) ====== */}
          <NavbarContent className="hidden lg:flex gap-2" justify="center">
            {navItems.map((item) => (
              <NavbarItem key={item.href}>
                <Link
                  className={clsx(
                    "flex items-center font-medium transition-colors duration-200",
                    "px-4 py-3 rounded-lg",
                    activeNav === item.label
                      ? "text-[#0d7a68] bg-[#0d7a68]/10"
                      : "text-gray-700 dark:text-gray-300 hover:text-[#0d7a68] hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                  to={item.href}
                  onClick={() => { setActiveNav(item.label); window.scrollTo(0, 0); }}
                >
                  <span className="mr-2">
                    {item.label === "store"
                      ? <StoreIconWrap />
                      : React.cloneElement(item.icon, {})
                    }
                  </span>
                  {t(item.label)}
                </Link>
              </NavbarItem>
            ))}
          </NavbarContent>

          {/* ====== DESKTOP RIGHT ACTIONS ====== */}
          <NavbarContent className="hidden lg:flex gap-2" justify="end">
            <div className="flex items-center gap-1 border-r border-gray-200 dark:border-gray-700 pr-3 mr-2">
              <Tooltip content="Facebook">
                <Button
                  isIconOnly variant="light" size="sm"
                  className="text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  as={Link} to={siteConfig.links.Messenger} target="_blank" rel="noopener noreferrer"
                >
                  <FaFacebookF size={16} />
                </Button>
              </Tooltip>
              <Tooltip content="TikTok">
                <Button
                  isIconOnly variant="light" size="sm"
                  as={Link} to="https://www.tiktok.com/@omelette_s_89?_r=1&_t=ZS-93FXh7mMjNR" target="_blank" rel="noopener noreferrer"
                  className="text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <FaTiktok size={16} />
                </Button>
              </Tooltip>
            </div>

            <NavbarItem>
              <Dropdown backdrop="blur">
                <DropdownTrigger>
                  <Button
                    variant="light"
                    className="flex items-center gap-2 min-w-[100px] justify-between"
                    startContent={
                      <div className="flex items-center gap-2">
                        <Image isBlurred alt="Language Flag" className="w-5 h-5 rounded-full" src={currentLanguage.flag} width={20} height={20} />
                        <span className="text-sm font-medium">{currentLanguage.code.toUpperCase()}</span>
                      </div>
                    }
                  />
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Language Selection" variant="flat"
                  selectionMode="single" selectedKeys={[currentLanguage.code]}
                  onAction={(key) => handleLanguageChange(key as string)}
                  className="min-w-[150px]"
                >
                  {languages.map((lang) => (
                    <DropdownItem key={lang.code} className={clsx("flex items-center gap-3 py-2", language === lang.code && "bg-[#0d7a68]/10 text-[#0d7a68]")}>
                      <Image alt={`${lang.name} Flag`} className="w-5 h-5 rounded" src={lang.flag} width={20} height={20} />
                      <span className="flex-1">{lang.name}</span>
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </NavbarItem>

            <NavbarItem><ThemeSwitch /></NavbarItem>

            <NavbarItem>
              <Button
                as={Link} to="/OMS_Login"
                className="bg-[#0d7a68] hover:bg-[#0b6a5a] text-white font-medium px-6"
                startContent={<AiOutlineUser />}
                onClick={() => window.scrollTo(0, 0)}
              >
                {t("login")}
              </Button>
            </NavbarItem>
          </NavbarContent>

          {/* ====== MOBILE VIEW (below 768px) ====== */}
          <NavbarContent className="md:hidden" justify="end">
            <NavbarItem>
              <Dropdown backdrop="blur">
                <DropdownTrigger>
                  <Button isIconOnly variant="light" size="sm" className="min-w-[40px]">
                    <Image isBlurred alt="Language Flag" className="w-5 h-5 rounded-full" src={currentLanguage.flag} width={20} height={20} />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Language Selection" variant="flat"
                  selectionMode="single" selectedKeys={[currentLanguage.code]}
                  onAction={(key) => handleLanguageChange(key as string)}
                >
                 {languages.map((lang) => (
  <DropdownItem
    key={lang.code}
    className={clsx("flex items-center gap-3", language === lang.code && "bg-[#0d7a68]/10 text-[#0d7a68]")}
  >
    <Image
      alt={`${lang.name} Flag`}
      className="w-5 h-5 rounded"
      src={lang.flag}
      width={20}
      height={20}
      // isBlurred removed here
    />
    <span>{lang.name}</span>
  </DropdownItem>
))}
                </DropdownMenu>
              </Dropdown>
            </NavbarItem>
            <NavbarItem><ThemeSwitch /></NavbarItem>
            <NavbarItem>
              <NavbarMenuToggle
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                icon={isMenuOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
              />
            </NavbarItem>
          </NavbarContent>

          {/* ====== MOBILE & TABLET MENU ====== */}
          <NavbarMenu className="pt-0 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 m-0">
            <div className="px-4 md:px-6 py-4 max-h-[80vh] overflow-y-auto">
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  {t("navigation") || "Menu"}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={clsx(
                        "flex flex-col items-center p-4 rounded-xl transition-all duration-300 text-center border",
                        activeNav === item.label
                          ? "border-[#0d7a68] bg-[#0d7a68]/10"
                          : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-[#0d7a68]/30"
                      )}
                      onClick={() => { setActiveNav(item.label); setIsMenuOpen(false); window.scrollTo(0, 0); }}
                    >
                      <div className={clsx(
                        "text-xl mb-2",
                        activeNav === item.label ? "text-[#0d7a68]" : "text-gray-600 dark:text-gray-400"
                      )}>
                        {item.label === "store" ? <StoreIconWrap /> : item.icon}
                      </div>
                      <span className={clsx(
                        "font-medium text-sm",
                        activeNav === item.label ? "text-[#0d7a68]" : "text-gray-800 dark:text-gray-200"
                      )}>
                        {t(item.label)}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Language Selection */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  {t("language") || "Language"}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => handleLanguageChange(lang.code)}
                      className={clsx(
                        "flex items-center justify-center gap-2 p-3 rounded-lg border transition-all duration-300",
                        language === lang.code
                          ? "bg-[#0d7a68] text-white border-[#0d7a68]"
                          : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-[#0d7a68]"
                      )}
                    >
                      <Image alt={`${lang.name} Flag`} className="w-5 h-5 rounded" src={lang.flag} width={20} height={20} />
                      <span className="text-sm">{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Social Links */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  {t("contact_us") || "Connect"}
                </h3>
                <div className="flex gap-2 mb-4">
                  <Button isIconOnly variant="flat" size="sm" className="flex-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                    as={Link} to={siteConfig.links.Messenger} target="_blank" rel="noopener noreferrer">
                    <FaFacebookF size={18} />
                  </Button>
                  <Button isIconOnly variant="flat" size="sm" className="flex-1 bg-gray-900 dark:bg-gray-800 text-white"
                    as={Link} to="https://www.tiktok.com/@omelette_s_89?_r=1&_t=ZS-93FXh7mMjNR" target="_blank" rel="noopener noreferrer">
                    <FaTiktok size={18} />
                  </Button>
                  <Button isIconOnly variant="flat" size="sm" className="flex-1 bg-red-50 dark:bg-red-900/20 text-pink-600"
                    as={Link} to="https://www.instagram.com/omelette_s_89?igsh=MjUwbGhrbnAyNHIz&utm_source=qr" target="_blank" rel="noopener noreferrer">
                    <FaInstagram size={18} />
                  </Button>
                </div>
              </div>

              {/* Login Button */}
              <Button
                as={Link} to="/OMS_Login"
                className="w-full bg-[#0d7a68] hover:bg-[#0b6a5a] text-white font-medium py-4 mb-4"
                startContent={<AiOutlineUser size={20} />}
                onClick={() => { setIsMenuOpen(false); window.scrollTo(0, 0); }}
              >
                {t("login")}
              </Button>

              {/* Footer Info */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                   <Button
                as={Link} to="/OMS_chinese"
                className="w-full bg-[#2a2b2b] hover:bg-[#0b6a5a] text-white font-medium py-4 mb-4"
                startContent={<AiFillSignature size={20} />}  
                onClick={() => { setIsMenuOpen(false); window.scrollTo(0, 0); }}
              >
                {t("Learning Chinese")}
              
              </Button>
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                  Copyright © 2023-2026 Omelette<span className="text-[#E43636]">'</span>s. All rights reserved.
                </p>
              </div>
            </div>
          </NavbarMenu>
        </HeroUINavbar>
      </div>
    </>
  );
};