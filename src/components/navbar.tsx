import { useState, useEffect } from "react";
import { Button } from "@heroui/button";
import { FaFacebookF } from "react-icons/fa";
import { BsBookmarkFill } from "react-icons/bs";
import { Link } from "@heroui/link";
import { t } from "i18next";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@heroui/modal";
import { useTranslation } from "react-i18next";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@heroui/navbar";
import { link as linkStyles } from "@heroui/theme";
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

export const Navbar = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [language, setLanguage] = useState("en");
  const [storeAccordionOpen, setStoreAccordionOpen] = useState(false);

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const { i18n } = useTranslation();

  const handleLanguageChange = (lang_code: string) => {
    setLanguage(lang_code);
    localStorage.setItem("language", lang_code);
    i18n.changeLanguage(lang_code);
  };

  const getLanguageFlag = () => {
    switch (language) {
      case "en":
        return "/image/united-kingdom.png";
      case "la":
        return "/image/laos.png";
      case "zh":
        return "/image/china.png";
      case "th":
        return "/image/thailand.png";
      default:
        return "/image/united-kingdom.png";
    }
  };

  const flag = getLanguageFlag();

  const getAnnouncementImage = (lang: string) => {
    switch (lang) {
      case "la":
        return "/image/an/L.png";
      case "th":
        return "/image/an/T.png";
      case "zh":
        return "/image/an/Z.png";
      case "en":
      default:
        return "/image/an/E.png";
    }
  };

  const img = getAnnouncementImage(i18n.language);

  return (
    <>
      {/* Fixed Navbar */}
      <HeroUINavbar
        className="bg-white dark:bg-gray-900 fixed top-0 left-0 w-full z-[1000] shadow-md"
        isBlurred
        maxWidth="full"
      >
        {/* Brand & Desktop/Tablet nav items */}
        <NavbarContent
          className="basis-full sm:basis-1/5 flex flex-wrap sm:flex-nowrap items-center gap-2"
          justify="start"
        >
          <NavbarBrand className="max-w-fit flex-shrink-0">
            <Image
              isBlurred
              alt="omellets logo"
              src="https://res.cloudinary.com/deahgtn57/image/upload/v1751616678/omelett%27s/public/image/ChatGPT_Image_Jun_29_2025_02_29_59_PM_vmvihs.png"
              width={70}
              className="h-auto"
            />
            
          </NavbarBrand>

          {/* Desktop links */}
      
<div className="hidden md:flex lg:gap-6 ml-4 flex-wrap items-center">
  {siteConfig.navItems.map((item) => (
    <NavbarItem key={item.href} className="whitespace-nowrap">
      <Link
        className={clsx(
          linkStyles({ color: "foreground" }),
          "data-[active=true]:text-primary data-[active=true]:font-medium",
          "text-base font-semibold"
        )}
        color="foreground"
        href={item.href}
      >
        <div
          className="hidden md:inline-block h-5 w-1 mr-2 rounded"
          style={{ backgroundColor: "#1D6B3F" }}
        />
        {t(item.label)}
      </Link>
    </NavbarItem>
  ))}

  {/* Desktop accordion */}
  {/* Desktop accordion */}
<div className="relative">
  <button
    onClick={() => setStoreAccordionOpen(!storeAccordionOpen)}
    className={clsx(
      linkStyles({ color: "foreground" }),
      "flex items-center text-base font-semibold text-default-500 hover:text-[#0d7a68] focus:outline-none"
    )}
  >
    <div
      className="hidden md:inline-block h-5 w-1 mr-2 rounded"
      style={{ backgroundColor: "#1D6B3F" }}
    />
    {t("store")}
    <svg
      className={`ml-1 w-4 h-4 transition-transform duration-300 ${
        storeAccordionOpen ? "rotate-180" : ""
      }`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  </button>

  {storeAccordionOpen && (
    <div className="absolute mt-2 bg-white dark:bg-gray-800 border border-default-200 rounded-md shadow-lg py-2 w-48 z-50">
      <Link
        href="/omelettes"
        className="flex items-center px-4 py-2 text-default-500 hover:bg-green-100 dark:hover:bg-green-900"
      >
        <Image
          isBlurred
          alt="Omelettes"
          className="inline-block mr-2 w-5 h-5"
          src="/image/menu/om.png"
        />
        {t("omelettes")}
      </Link>
      <Link
        href="/thee_eaves"
        className="flex items-center px-4 py-2 text-default-500 hover:bg-green-100 dark:hover:bg-green-900"
      >
        <Image
          isBlurred
          alt="Thee Eaves"
          className="inline-block mr-2 w-5 h-5"
          src="/image/menu/th.png"
        />
        {t("thee_eaves")}
      </Link>
    </div>
  )}
</div>

</div>

        </NavbarContent>

        {/* Desktop right side */}
        <NavbarContent
          className="hidden md:flex basis-full sm:basis-1/5 items-center justify-end gap-3 flex-wrap"
          justify="end"
        >
          <NavbarItem>
            <ThemeSwitch />
          </NavbarItem>

          <NavbarItem className="hidden md:flex">
            <Tooltip content={t("facebook page")}>
              <Button
                isExternal
                as={Link}
                className="text-sm font-normal text-default-600 bg-default-100"
                href={siteConfig.links.Messenger}
                startContent={<FaFacebookF className="text-blue-600" size={22} />}
                variant="flat"
              />
            </Tooltip>
          </NavbarItem>

          <Tooltip content={t("language")}>
            <NavbarItem>
              <Dropdown backdrop="blur">
                <DropdownTrigger>
                  <button className="flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#0d7a68]">
                    <Image
                      isBlurred
                      alt="Language Flag"
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded"
                      height={25}
                      src={flag}
                      width={25}
                    />
                    <span className="hidden sm:inline text-sm font-medium select-none">
                      {language === "en"
                        ? "English"
                        : language === "la"
                        ? "ລາວ"
                        : language === "zh"
                        ? "中文"
                        : "ไทย"}
                    </span>
                  </button>
                </DropdownTrigger>

                <DropdownMenu aria-label="Language Selection" variant="faded">
                  <DropdownItem key="en" onPress={() => handleLanguageChange("en")}>
                    English
                  </DropdownItem>
                  <DropdownItem key="la" onPress={() => handleLanguageChange("la")}>
                    ລາວ
                  </DropdownItem>
                  <DropdownItem key="zh" onPress={() => handleLanguageChange("zh")}>
                    中文
                  </DropdownItem>
                  <DropdownItem key="th" onPress={() => handleLanguageChange("th")}>
                    ไทย
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </NavbarItem>
          </Tooltip>

          <Tooltip content={t("anouncement")}>
            <button
              onClick={onOpen}
              className="p-1 rounded hover:text-[#0d7a68] focus:outline-none focus:ring-2 focus:ring-[#0d7a68]"
              aria-label={t("anouncement")}
            >
              <BsBookmarkFill className="text-default-500" size={25} />
            </button>
          </Tooltip>

          <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent className="w-full max-w-2xl">
              <>
                <ModalHeader className="flex flex-col gap-1">{t("anouncement")}</ModalHeader>
                <ModalBody className="flex flex-col gap-2">
                  <Image
                    isBlurred
                    alt="Announcement Image"
                    className="w-full h-auto rounded"
                    src={img}
                  />
                </ModalBody>
              </>
            </ModalContent>
          </Modal>
        </NavbarContent>

        {/* Mobile right side */}
        <NavbarContent
          className="flex md:hidden basis-full items-center justify-end gap-2 pr-4"
          justify="end"
        >
          <ThemeSwitch />
          <NavbarItem>
            <Dropdown backdrop="blur">
              <DropdownTrigger>
                <button className="flex items-center gap-1 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0d7a68]">
                  <Image
                    isBlurred
                    alt="Language Flag"
                    className="w-6 h-6 rounded"
                    height={25}
                    src={flag}
                    width={25}
                  />
                  <span className="hidden sm:inline text-sm font-medium select-none">
                    {language === "en"
                      ? "English"
                      : language === "la"
                      ? "ລາວ"
                      : language === "zh"
                      ? "中文"
                      : "ไทย"}
                  </span>
                </button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Language Selection" variant="faded">
                <DropdownItem key="en" onPress={() => handleLanguageChange("en")}>
                  English
                </DropdownItem>
                <DropdownItem key="la" onPress={() => handleLanguageChange("la")}>
                  ລາວ
                </DropdownItem>
                <DropdownItem key="zh" onPress={() => handleLanguageChange("zh")}>
                  中文
                </DropdownItem>
                <DropdownItem key="th" onPress={() => handleLanguageChange("th")}>
                  ไทย
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
          <NavbarMenuToggle />
        </NavbarContent>

        {/* Mobile menu */}
        <NavbarMenu>
          <div className="mx-4 mt-2 flex flex-col gap-3">
             <div className="border-t border-default-200 pt-2">
              <button
                onClick={() => setStoreAccordionOpen(!storeAccordionOpen)}
                className="flex justify-between items-center w-full text-default-500 hover:text-[#0d7a68] text-lg font-normal focus:outline-none"
              >
                {t("store") /* Adjust this key in your translation file */}
                <svg
                  className={`w-5 h-5 transition-transform duration-300 ${
                    storeAccordionOpen ? "rotate-180" : "rotate-0"
                  }`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {storeAccordionOpen && (
                <div className="mt-2 flex flex-col pl-4 gap-2">
                  <Link
                    href="/omelettes"
                    className="text-default-500 hover:text-[#0d7a68] text-base font-normal"
                  >
                   <Image
                      isBlurred
                      alt="Omelettes"
                      className="inline-block mr-2 w-5 h-5"
                      src="/image/menu/om.png"
                    />
                    {t("omelettes")}
                  </Link>
                  <Link
                    href="/thee_eaves"
                    className="text-default-500 hover:text-[#0d7a68] text-base font-normal"
                  >
                    <Image
                      isBlurred
                      alt="Thee Eaves"
                      className="inline-block mr-2 w-5 h-5"
                      src="/image/menu/th.png"
                    />
                    {t("thee_eaves")}
                  </Link>
                </div>
              )}
            </div>
            {siteConfig.navMenuItems.map((item, index) => (
              <NavbarMenuItem key={`${item}-${index}`}>
                <Link
                  className="text-default-500 hover:text-[#0d7a68] text-lg font-normal"
                  color="foreground"
                  href={item.href}
                >
                  {t(item.label)}
                </Link>
              </NavbarMenuItem>
            ))}

            {/* Existing omelettes link */}
            {/* <div>
              <Link
                className="text-default-500 hover:text-green-500 text-lg font-normal"
                href="/omelettes"
              >
                {t("omellets")}
              </Link>
            </div> */}

            {/* New Accordion Dropdown for store pages */}
           

            {/* Existing announcement button */}
            <div>
              <button
                className="text-default-500 hover:text-[#0d7a68] text-lg font-normal"
                onClick={onOpen}
              >
                {t("anouncement")}
              </button>
            </div>

            {/* Announcement modal */}
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
              <ModalContent className="w-full max-w-2xl">
                <>
                  <ModalHeader className="flex flex-col gap-1 bg-[#1D6B3F] text-white">
                    {t("anouncement")}
                  </ModalHeader>
                  <ModalBody className="flex flex-col gap-2">
                    <Image
                      isBlurred
                      alt="Announcement Image"
                      className="w-full h-auto rounded"
                      src={img}
                    />
                  </ModalBody>
                </>
              </ModalContent>
            </Modal>
          </div>
        </NavbarMenu>
      </HeroUINavbar>

      {/* Push content down so it's not hidden behind fixed navbar */}
      <div className="h-[70px]"></div>
    </>
  );
};
