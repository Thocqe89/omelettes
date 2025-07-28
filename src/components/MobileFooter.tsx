import  { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa6";
import { Link } from "@heroui/link";
// import { useDisclosure } from "@heroui/modal";
import { FiTruck } from "react-icons/fi";
// import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
// import { Image } from "@heroui/image";
import { useTranslation } from "react-i18next";
import { AiOutlineHome, AiOutlineShopping,  } from "react-icons/ai";
// import i18n from "@/i18n";
// import { SiGnuprivacyguard } from "react-icons/si";




export const MobileFooter = () => {
  const { t } = useTranslation();
  // const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [activeTab, setActiveTab] = useState("home");

// const getAnnouncementImage = (lang: string) => {
//   switch (lang) {
//     case "la":
//       return "/image/an/L.png";
//     case "th":
//       return "/image/an/T.png";
//     case "zh":
//       return "/image/an/Z.png";
//     case "en":
//       return "/image/an/E.png";

//   }
// };

// const img = getAnnouncementImage(i18n.language);



  // Detect current path on page load and update active tab
  useEffect(() => {
/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Generates a string of CSS class names for a navigation item based on the provided path.
 * 
 * @param path - The path to compare with the current pathname.
 * @returns A string containing CSS class names. If the provided path matches the current pathname,
 * the text color is set to green. Otherwise, the text color defaults with a hover effect to green.
 */

/*******  c58481ae-36ec-44ef-8c0b-00b6b03693cb  *******/    const path = window.location.pathname;
    if (path === "/") setActiveTab("home");
    else if (path.startsWith("/store")) setActiveTab("store");
    else if (path.startsWith("/dataCheck")) setActiveTab("dataCheck");
     else if (path.startsWith("/anouncement")) setActiveTab("anouncement");
    else setActiveTab(""); // fallback
  }, [window.location.pathname]);

const navItemClass = (tab: string) =>
  `flex flex-col items-center gap-1 -mt-6 transition duration-200 transform ${
    activeTab === tab
      ? "text-[#0d7a68] scale-100"
      : "text-default-500 hover:text-[#0d7a68] hover:scale-110"
  }`;



const textClass = (tab: string) =>
  `text-[11px] font-medium transition duration-200 ${
    activeTab === tab
      ? "text-[#0d7a68]"
      : "text-default-500 hover:text-[#0d7a68]"
  }`;


  return (
<div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/70 dark:bg-gray-900/70 border-t border-default-100 shadow-md flex justify-around pt-8 pb-8 text-xs backdrop-blur-sm">
 
      <Link href="/" onClick={() => setActiveTab("home")} className= {navItemClass("home")}>
        <AiOutlineHome size={24} />
        
        <p className={textClass("home")}>{t("home")}</p>
      </Link>

      <Link href="/store" onClick={() => setActiveTab("store")} className={navItemClass("store")}>
        <AiOutlineShopping size={24} />
        <p className={textClass("store")}>{t("store")}</p>
      </Link>

      <Link href="/dataCheck"onClick={() => setActiveTab("dataCheck")} className={navItemClass("dataCheck")}>
        <FiTruck size={24} />
        <p className={textClass("dataCheck")}>{t("logistics")}</p>
      </Link>
{/* Modal
      <Link
        onClick={() => {
          setActiveTab("saved");
          onOpen();
        }}
        className={navItemClass("saved")}
      >
        <SiGnuprivacyguard size={24} />
        <p className={textClass("saved")}>{t("anouncement")}</p>
      </Link>   */}


      <Link
        href="https://wa.me/2055058028?text=Hi,%20I%20need%20help%20with%20your%20services.%20Can%20an%20assistant%20assist%20me?%20%0A%0Aສະບາຍດີ,%20ຂ້ອຍມີຄຳຖາມ%20?"
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => setActiveTab("help")}
        className={navItemClass("help")}
      >
        <FaWhatsapp size={24} />
        <p className={textClass("help")}>{t("help")}</p>
      </Link>

      {/* Modal */}
      {/* <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent className="w-full max-w-2xl">
          <>
            <ModalHeader style={{ backgroundColor: "#0d7a68", color: "white" }}>
  <div className="flex items-center justify-between w-full">
    <span className="text-lg font-semibold">{t("anouncement")}</span>
    <h5 className="text-white text-sm opacity-90">| 15-May-2025 Vientiane Lao PDR</h5>
  </div>
</ModalHeader>
           
            <ModalBody>
              <Image isBlurred className="w-full h-auto" src={img} alt="Announcement" />
              
            </ModalBody>
            
          </>
        </ModalContent>
      </Modal> */}
    </div>
  );
};
