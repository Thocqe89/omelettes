import { Link } from "@heroui/link";
import { Navbar } from "@/components/navbar";
import { FaChevronUp } from "react-icons/fa6";

// import { Tooltip } from "@heroui/tooltip";
// import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

import Loading from "@/components/loading";
import { MobileFooter } from "@/components/MobileFooter";

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
   const [showScrollTop, setShowScrollTop] = useState(false);
  // const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
 const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  useEffect(() => {
  const handleScroll = () => {
    const threshold = window.innerWidth < 768 ? 100 : 300;
    setShowScrollTop(window.scrollY > threshold);
  };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
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
      <Navbar />
     <main className="flex-grow pb-8" > {/* Add this padding-bottom */}
  <div className="w-full overflow-x-hidden">
    {isLoading ? <Loading /> : children}
  </div>

        {/* WhatsApp Button (only on medium+ screens) */}
        {/* <div className="fixed bottom-6 right-6 z-40 hidden md:block">
          <Tooltip content={t("hello")} placement="left">
            <button
              className="rounded-full shadow-lg bg-white/90 hover:bg-[#0d7a68]  transition-all p-2"
              onClick={() => {
                window.location.href = "https://wa.me/2055058028?text=Hi,%20I%20need%20help%20with%20your%20services.%20Can%20an%20assistant%20assist%20me?%20%0A%0Aສະບາຍດີ,%20ຂ້ອຍມີຄຳຖາມ%20?";
              }}
            >
              <Image
                isZoomed
                src="/image/cp-1-r.png"
                alt="Contact Us"
                width={80}
                className="w-10 h-10"
              />
            </button>
          </Tooltip>
        </div> */}

              {/* Scroll to Top Button */}
  {showScrollTop && (
  <button
    onClick={scrollToTop}
    className="fixed bottom-[90px] left-1/2 -translate-x-1/2 z-[10000]   text-[#0d7a68] p-2 sm:p-3 rounded-full shadow-lg  transition"
    aria-label="Scroll to top"
  >
   <FaChevronUp size={24} className="sm:size-10 animate-bounce hover:animate-none" /> 
    {/* <img src="/image/cp-1-r.png" alt="Contact Us" width={80} className="w-10 h-10 animate-bounce hover:animate-none" /> */}
  </button>
)}






      </main>
      <br></br>
     
<MobileFooter />
      
      

      {/* Footer */}
      <footer
  className="w-full  items-center justify-center py-3 px-4 text-center text-sm flex-wrap gap-2 shadow-lg h hidden sm:flex touch-manipulation overscroll-none"
  style={{
    background: 'linear-gradient(to top, #0d7a68 0%, #0d7a68 80%, white 10%, white 100%)', /* Dark green to white */
    borderRadius: '10px 10px 0 0', /* Rounded top corners */
  /* Optional: subtle top border */
    borderTop: '2px solid rgba(0, 0, 0, 0.1)',
  }}
>
  <Link 
    isExternal
    className="flex items-center gap-1 text-white"
    href="https://www.facebook.com/profile.php?id=100092652948333"
    title="Omelette's"
  >
    <span className="text-wihite">Powered by</span>
    <p className="text-wihite">Omelette's</p>
  </Link>
  <span className="mx-1 text-white">|</span>
  <span className="text-white">Copyright © 2023-2025 </span>
 
  <span className="mx-1 text-white">|</span>
  <span className="text-white">Version 0.0.1</span>
  
</footer>
    </div>
  );
}
