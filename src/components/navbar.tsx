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
  AiOutlineIdcard
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

  // Sync language with i18n on mount
  useEffect(() => {
    setLanguage(i18n.language);
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage && savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage);
    }

    // Set active nav based on current path
    const path = location.pathname;
    if (path === "/") setActiveNav("home");
    else if (path.startsWith("/about")) setActiveNav("about_us");
    else if (path.startsWith("/Omelette's")) setActiveNav("store");
    else if (path.startsWith("/help")) setActiveNav("help");
    else setActiveNav("");

    // Add scroll effect for navbar
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [i18n, location]);

  // Update language when i18n changes
  useEffect(() => {
    setLanguage(i18n.language);
  }, [i18n.language]);

  // Update active nav when location changes
  useEffect(() => {
    const path = location.pathname;
    if (path === "/") setActiveNav("home");
    else if (path.startsWith("/about")) setActiveNav("about_us");
    else if (path.startsWith("/Omelette's")) setActiveNav("store");
    else if (path.startsWith("/help")) setActiveNav("help");
    else setActiveNav("");
  }, [location]);

  const handleLanguageChange = async (langCode: string) => {
    try {
      localStorage.setItem("language", langCode);
      await i18n.changeLanguage(langCode);
      setLanguage(langCode);
      
      if (isMenuOpen) {
        setIsMenuOpen(false);
      }
      
      setTimeout(() => {
        window.location.reload();
      }, 100);
      
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
    { href: "/Omelette's", label: "store", icon: <AiOutlineShopping /> },
  ];

  // First 3 items for tablet icon navigation
  const tabletNavItems = navItems.slice(0, 3);

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
        
        .content-after-navbar {
          margin-top: 64px;
        }
        
        main {
          padding-top: 64px;
        }
        
        @media (max-width: 768px) {
          .content-after-navbar {
            margin-top: 64px;
          }
          main {
            padding-top: 64px;
          }
        }
        
        @media (max-width: 640px) {
          .content-after-navbar {
            margin-top: 64px;
          }
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
          <NavbarContent justify="start" className="p-0 m-0">
            <NavbarBrand className="gap-3 m-0 p-0">
              <Image
                isBlurred
                alt="Omelette's logo"
                src="https://res.cloudinary.com/deahgtn57/image/upload/v1751616678/omelett%27s/public/image/ChatGPT_Image_Jun_29_2025_02_29_59_PM_vmvihs.png"
                width={50}
                height={50}
                className="rounded-lg shadow-sm"
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
          {/* Icon-only navigation + Dropdown at the end */}
          <NavbarContent className="hidden md:flex lg:hidden gap-1" justify="center">
            {/* Icon navigation for first 3 items */}
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
                  onClick={() => {
                    setActiveNav(item.label);
                    window.scrollTo(0, 0);
                  }}
                >
                  <span className="text-lg mb-1">{item.icon}</span>
                  <span className="text-xs">{t(item.label)}</span>
                </Link>
              </NavbarItem>
            ))}
          </NavbarContent>

          {/* ====== TABLET RIGHT SIDE ====== */}
          <NavbarContent className="hidden md:flex lg:hidden gap-1" justify="end">
            {/* Language Selector (Icon only) */}
            <NavbarItem>
              <Dropdown backdrop="blur">
                <DropdownTrigger>
                  <Button
                    isIconOnly
                    variant="light"
                    size="sm"
                    className="min-w-[40px] h-[40px]"
                  >
                    <Image
                      isBlurred
                      alt="Language Flag"
                      className="w-5 h-5 rounded-full"
                      src={currentLanguage.flag}
                      width={20}
                      height={20}
                    />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu 
                  aria-label="Language Selection" 
                  variant="flat"
                  selectionMode="single"
                  selectedKeys={[currentLanguage.code]}
                  onAction={(key) => handleLanguageChange(key as string)}
                >
                  {languages.map((lang) => (
                    <DropdownItem 
                      key={lang.code}
                      className={clsx(
                        "flex items-center gap-3",
                        language === lang.code && "bg-[#0d7a68]/10 text-[#0d7a68]"
                      )}
                    >
                      <Image
                        alt={`${lang.name} Flag`}
                        className="w-5 h-5 rounded"
                        src={lang.flag}
                        width={20}
                        height={20}
                      />
                      <span>{lang.name}</span>
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </NavbarItem>

            {/* Theme Switch - FIXED: Added back */}
            <NavbarItem>
              <ThemeSwitch />
            </NavbarItem>

            {/* Tablet Menu Toggle - At the end as requested */}
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
                  onClick={() => {
                    setActiveNav(item.label);
                    window.scrollTo(0, 0);
                  }}
                >
                  {React.cloneElement(item.icon, { className: "mr-2" })}
                  {t(item.label)}
                </Link>
              </NavbarItem>
            ))}
          </NavbarContent>

          {/* ====== DESKTOP RIGHT ACTIONS ====== */}
          <NavbarContent className="hidden lg:flex gap-2" justify="end">
            {/* Social Links */}
            <div className="flex items-center gap-1 border-r border-gray-200 dark:border-gray-700 pr-3 mr-2">
              <Tooltip content="Facebook">
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  className="text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  as={Link}
                  to={siteConfig.links.Messenger}
                   target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebookF size={16} />
                </Button>
              </Tooltip>
              <Tooltip content="TikTok">
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  as={Link}
                  to="https://www.tiktok.com/@omelette_s_89?_r=1&_t=ZS-93FXh7mMjNR"
                    target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-800 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <FaTiktok size={16} />
                </Button>
              </Tooltip>
            </div>

            {/* Language Selector - Desktop */}
            <NavbarItem>
              <Dropdown backdrop="blur">
                <DropdownTrigger>
                  <Button
                    variant="light"
                    className="flex items-center gap-2 min-w-[100px] justify-between"
                    startContent={
                      <div className="flex items-center gap-2">
                        <Image
                          isBlurred
                          alt="Language Flag"
                          className="w-5 h-5 rounded-full"
                          src={currentLanguage.flag}
                          width={20}
                          height={20}
                        />
                        <span className="text-sm font-medium">
                          {currentLanguage.code.toUpperCase()}
                        </span>
                      </div>
                    }
                  >
                  </Button>
                </DropdownTrigger>
                <DropdownMenu 
                  aria-label="Language Selection" 
                  variant="flat"
                  selectionMode="single"
                  selectedKeys={[currentLanguage.code]}
                  onAction={(key) => handleLanguageChange(key as string)}
                  className="min-w-[150px]"
                >
                  {languages.map((lang) => (
                    <DropdownItem 
                      key={lang.code}
                      className={clsx(
                        "flex items-center gap-3 py-2",
                        language === lang.code && "bg-[#0d7a68]/10 text-[#0d7a68]"
                      )}
                    >
                      <Image
                        alt={`${lang.name} Flag`}
                        className="w-5 h-5 rounded"
                        src={lang.flag}
                        width={20}
                        height={20}
                      />
                      <span className="flex-1">{lang.name}</span>
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </NavbarItem>

            {/* Theme Switch */}
            <NavbarItem>
              <ThemeSwitch />
            </NavbarItem>

            {/* Login Button */}
            <NavbarItem>
              <Button
                as={Link}
                to="/OMS_Login"
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
            {/* Language Selector (Mobile) - Icon only */}
            <NavbarItem>
              <Dropdown backdrop="blur">
                <DropdownTrigger>
                  <Button
                    isIconOnly
                    variant="light"
                    size="sm"
                    className="min-w-[40px]"
                  >
                    <Image
                      isBlurred
                      alt="Language Flag"
                      className="w-5 h-5 rounded-full"
                      src={currentLanguage.flag}
                      width={20}
                      height={20}
                    />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu 
                  aria-label="Language Selection" 
                  variant="flat"
                  selectionMode="single"
                  selectedKeys={[currentLanguage.code]}
                  onAction={(key) => handleLanguageChange(key as string)}
                >
                  {languages.map((lang) => (
                    <DropdownItem 
                      key={lang.code}
                      className={clsx(
                        "flex items-center gap-3",
                        language === lang.code && "bg-[#0d7a68]/10 text-[#0d7a68]"
                      )}
                    >
                      <Image
                        alt={`${lang.name} Flag`}
                        className="w-5 h-5 rounded"
                        src={lang.flag}
                        width={20}
                        height={20}
                      />
                      <span>{lang.name}</span>
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </NavbarItem>

            {/* Theme Switch - FIXED: Added back to mobile */}
            <NavbarItem>
              <ThemeSwitch />
            </NavbarItem>

            {/* Mobile Menu Toggle - At the end as requested */}
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
              {/* Main Navigation */}
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
                      onClick={() => {
                        setActiveNav(item.label);
                        setIsMenuOpen(false);
                        window.scrollTo(0, 0);
                      }}
                    >
                      <div className={clsx(
                        "text-xl mb-2",
                        activeNav === item.label ? "text-[#0d7a68]" : "text-gray-600 dark:text-gray-400"
                      )}>
                        {item.icon}
                      </div>
                      <span className={clsx(
                        "font-medium text-sm",
                        activeNav === item.label 
                          ? "text-[#0d7a68]" 
                          : "text-gray-800 dark:text-gray-200"
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
                      <Image
                        alt={`${lang.name} Flag`}
                        className="w-5 h-5 rounded"
                        src={lang.flag}
                        width={20}
                        height={20}
                      />
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
                  <Button
                    isIconOnly
                    variant="flat"
                    size="sm"
                    className="flex-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600"
                    as={Link}
                    to={siteConfig.links.Messenger}
                     target="_blank"
                  rel="noopener noreferrer"
                  >
                    <FaFacebookF size={18} />
                  </Button>
                  <Button
                    isIconOnly
                    variant="flat"
                    size="sm"
                    className="flex-1 bg-gray-900 dark:bg-gray-800 text-white"
                    as={Link}
                    to="https://www.tiktok.com/@omelette_s_89?_r=1&_t=ZS-93FXh7mMjNR"
                     target="_blank"
                  rel="noopener noreferrer"
                  >
                    <FaTiktok size={18} />
                  </Button>
                  <Button
                    isIconOnly
                    variant="flat"
                    size="sm"
                    className="flex-1 bg-red-50 dark:bg-red-900/20 text-pink-600"
                    as={Link}
                    to="https://www.instagram.com/omelette_s_89?igsh=MjUwbGhrbnAyNHIz&utm_source=qr"
                       target="_blank"
                  rel="noopener noreferrer"
                  >
                    <FaInstagram size={18} />
                  </Button>
                </div>
              </div>

              {/* Theme Switch in Menu (Mobile/Tablet) */}
              {/* <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  {t("theme") || "Theme"}
                </h3>
                <div className="flex justify-center">
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <ThemeSwitch />
                  </div>
                </div>
              </div> */}

              {/* Login Button */}
              <Button
                as={Link}
                to="/OMS_Login"
                className="w-full bg-[#0d7a68] hover:bg-[#0b6a5a] text-white font-medium py-4 mb-4"
                startContent={<AiOutlineUser size={20} />}
                onClick={() => {
                  setIsMenuOpen(false);
                  window.scrollTo(0, 0);
                }}
              >
                {t("login")}
              </Button>

              {/* Footer Info */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
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