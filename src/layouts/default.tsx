import { Link } from "@heroui/link";
import { AiOutlineUp } from "react-icons/ai";
// import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

import { Navbar } from "@/components/navbar";
import Loading from "@/components/loading";
import { MobileFooter } from "@/components/MobileFooter";
// import { ToastProvider } from "@heroui/toast";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
       {/* <ToastProvider placement="top-right" toastOffset={60} /> */}
      <main className="flex-grow pb-8">
        {" "}
        {/* Add this padding-bottom */}
       
        <div className="w-full overflow-x-hidden">
          {isLoading ? <Loading /> : children}
        </div>
        
        {showScrollTop && (
          <button
            aria-label="Scroll to top"
            className="fixed bottom-[80px] left-1/2 -translate-x-1/2 z-[10000]   text-[#0d7a68] p-2 sm:p-3 rounded-full  transition"
            onClick={scrollToTop}
          >
            <AiOutlineUp 
              className="sm:size-10 animate-bounce hover:animate-none"
              size={20}
            />
            {/* <img src="/image/cp-1-r.png" alt="Contact Us" width={80} className="w-10 h-10 animate-bounce hover:animate-none" /> */}
          </button>
        )}
      </main>
      <br />

      <MobileFooter />

      {/* Footer */}
      <footer
        className="w-full  items-center justify-center py-3 px-4 text-center text-sm flex-wrap gap-2 shadow-lg h hidden sm:flex touch-manipulation overscroll-none"
        style={{
          background:
            "linear-gradient(to top, #0d7a68 0%, #0d7a68 80%, white 10%, white 100%)" /* Dark green to white */,
          borderRadius: "10px 10px 0 0" /* Rounded top corners */,
          /* Optional: subtle top border */
          borderTop: "2px solid rgba(0, 0, 0, 0.1)",
        }}
      >
        <Link
          isExternal
          className="flex items-center gap-1 text-white"
          href="https://www.facebook.com/profile.php?id=100092652948333"
          title="Omelette's"
        >
          <span className="text-wihite">Powered by</span>
          <p className="text-wihite">Omelette&apos;s</p>
        </Link>
        <span className="mx-1 text-white">|</span>
        <span className="text-white">Copyright © 2023-2025 </span>

        <span className="mx-1 text-white">|</span>
        <span className="text-white">Version 0.0.1</span>
      </footer>
    </div>
  );
}
