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
 
  useDisclosure
} from "@heroui/modal";
import { useState, useEffect } from "react";
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

import { siteConfig } from "@/config/site";
import { ThemeSwitch } from "@/components/theme-switch";


import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown";

import { Tooltip } from "@heroui/tooltip";
import { Image } from "@heroui/image";

export const Navbar = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [language, setLanguage] = useState("en");



  useEffect(() => {
  
    const savedLanguage = localStorage.getItem("language");

    

    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);
  
  const { i18n } = useTranslation();
    // Function to handle language change
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
          return "/image/thailand.png"; // Add Thai flag image
       
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
      return "/image/an/E.png";

  }
};

const img = getAnnouncementImage(i18n.language);


  return (
    <HeroUINavbar maxWidth="xl"   position="sticky"  isBlurred={true} className="bg-white dark:bg-gray-900">
      <NavbarContent className="basis-1/5 sm:basis-full " justify="start" >
        <NavbarBrand className="gap-3 max-w-fit">
          <Link
            className="flex justify-start items-center gap-1"
            color="foreground"
            href="/about"
            title="Omelette's"
          >
          
        
          <div className="flex justify-center items-center h-full w-full">
              <Image
              isBlurred
                alt="omellets logo"
                src="https://res.cloudinary.com/deahgtn57/image/upload/v1751616678/omelett%27s/public/image/ChatGPT_Image_Jun_29_2025_02_29_59_PM_vmvihs.png"
                width={70}
               
                
               
              />
             
              
             
            </div>
           
            </Link>
        </NavbarBrand>
        <div className="hidden lg:flex gap-4 justify-start ml-2">
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
             
              <Link
                className={clsx(
                  linkStyles({ color: "foreground" }),
                  "data-[active=true]:text-primary data-[active=true]:font-medium"
                )}
                color="foreground"
                href={item.href}
              >
                 <div className="hidden md:block h-4 w-1  mr-2" style={{ backgroundColor: "#1D6B3F" }}></div>
              
                 {t(item.label)}

              </Link>
            </NavbarItem>
          ))}
          
        </div>
        
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
         
          </NavbarItem>
          <NavbarItem  >


<ThemeSwitch />



</NavbarItem> 

          <NavbarItem className="hidden md:flex">
          
          <div className="flex gap-2"> 
       
          <Tooltip content={t("facebook page")}>
          <Button
            isExternal
            as={Link}
            className="text-sm font-normal text-default-600 bg-default-100"
            href={siteConfig.links.Messenger}
            startContent={<FaFacebookF size={22} className="text-blue-600" />}
            variant="flat"
          >
            
          </Button>
          </Tooltip>
          </div>
        </NavbarItem>
        
        <Tooltip content={t("language")}>
<NavbarItem>

            <Dropdown backdrop="blur">
           
              <DropdownTrigger>
              
                <button className="flex items-center gap-1">
                
                  <Image
                    isBlurred
                    height={25} // Default size for larger screens
                    width={25} // Default size for larger screens
                    alt="Language Flag"
                    src={flag}
                    className="w-6 h-6 sm:w-8 sm:h-8 " // Responsive size for smaller screens
                  />
               
                   <span className="hidden sm:inline">
                  {language === "en"
                    ? "English"
                    : language === "la"
                    ? "ລາວ"
                    : language === "zh"
                    ? "中文"
                   
                    : "ไทย"
                    }
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
          <button onClick={onOpen}> <BsBookmarkFill  size={25} className="text-default-500 hover:text-[#0d7a68]"/></button> 
          </Tooltip>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent className="w-full max-w-2xl">
         
            <>
              <ModalHeader className="flex flex-col gap-1">{t("anouncement")}</ModalHeader>
              <ModalBody className="flex flex-col gap-2 ">
                <Image
                  isBlurred
                   className="w-full h-auto"
                  // className="rounded-lg md:block"
                  src={img}
                  alt="Omellet's Logo"
                
                />
              </ModalBody>
             
            </>
        
        </ModalContent>
      </Modal>
        {/* <NavbarItem className="hidden lg:flex">{searchInput}</NavbarItem> */}
        
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4 backdrop-blur-md" justify="end">
        {/* <Link isExternal href={siteConfig.links.github}>
          <GithubIcon className="text-default-500" />
        </Link> */}
        <ThemeSwitch />
        <NavbarItem >
            <Dropdown backdrop="blur">
              <DropdownTrigger>
                <button className="flex items-center gap-1">
                  
                  <Image
                    isBlurred
                    height={25} // Default size for larger screens
                    width={25} // Default size for larger screens
                    alt="Language Flag"
                    src={flag}
                    className="w-6 h-6 sm:w-8 sm:h-8 " // Responsive size for smaller screens
                  />
                   <span className="hidden sm:inline">
                  {language === "en"
                    ? "English"
                    : language === "la"
                    ? "ລາວ"
                    : language === "zh"
                    ? "中文"
                   
                    : "ไทย"
                    }
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
     
      <NavbarMenu>
       
        <div className="mx-4 mt-2 flex flex-col gap-2 ">
          
          {siteConfig.navMenuItems.map((item, index) => (
            <NavbarMenuItem 
            key={`${item}-${index}`}>
              <Link
                className="text-default-500 hover:text-[#0d7a68] text-1xl font-normal hover:cursor-pointer"
                color="foreground"
                href={item.href}
              >
                {t(item.label)}

              </Link>
             

            </NavbarMenuItem>
            
            
          ))}
         <div className="flex justify-start">
  <button
    className="text-default-500 hover:text-[#0d7a68] text-1xl font-normal hover:cursor-pointer"
    onClick={() => {
      window.location.href =
        "https://wa.me/2055058028?text=Hi,%20I%20need%20help%20with%20your%20services.%20Can%20an%20assistant%20assist%20me?%20%0A%0Aສະບາຍດີ,%20ຂ້ອຍມີຄຳຖາມ%20?";
    }}
  >
    {t("help")}
  </button>
</div>
<div className="flex justify-start">
  <button>
    <Link
      className="text-default-500 hover:text-green-500 text-1xl font-normal hover:cursor-pointer" 
      href="/logistics_dashboard"
    >
       {t("submitted_data")}
      
    </Link>
  </button>
</div>
<div className="flex justify-start">
<button  className="text-default-500 hover:text-green-500 text-1xl font-normal hover:cursor-pointer" onClick={onOpen}>{t("anouncement")}</button>
</div>
          
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent className="w-full max-w-2xl">
         
            <>
              <ModalHeader className="flex flex-col gap-1 "style={{ backgroundColor: "#1D6B3F" }}>{t("anouncement")}</ModalHeader>
              <ModalBody className="flex flex-col gap-2">
                <Image
                  isBlurred
                   className="w-full h-auto"
                  // className="rounded-lg md:block"
                  src={img}
                  alt="Omellet's Logo"
                
                />
              </ModalBody>
             
            </>
         
        </ModalContent>
      </Modal>
      
        </div>
        
      </NavbarMenu>
    </HeroUINavbar>
  );
};
