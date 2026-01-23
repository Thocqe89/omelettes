import { Link } from "@heroui/link";
import { AiOutlineUp } from "react-icons/ai";
import { useEffect, useState } from "react";

import { Navbar } from "@/components/navbar";
import Loading from "@/components/loading";
import { MobileFooter } from "@/components/MobileFooter";
import { ToastProvider } from "@heroui/toast";
import OMS_Loading from "@/components/oms_loading";

export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showScrollTop, setShowScrollTop] = useState(false);
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
      {/* <ToastProvider placement="bottom-right" toastOffset={60} /> */}
      <Navbar />
      
      {/* Main content - NO TOP PADDING, navbar is fixed */}
      <main className="flex-grow">
        <div className="w-full overflow-x-hidden">
          {isLoading ? (
            <>
              <Loading />
              {/* <OMS_Loading /> */}
            </>
          ) : (
            children
          )}
        </div>
        
        {/* Fixed Scroll to Top Button */}
        {/* {showScrollTop && (
          <button
            aria-label="Scroll to top"
            className="fixed z-[10000] bg-white dark:bg-slate-800 text-[#0d7a68] p-2 rounded-full shadow-lg border border-[#0d7a68] hover:bg-[#0d7a68] hover:text-white transition-all duration-300"
            style={{
              bottom: 'calc(80px + 1rem)',
              right: '1rem',
            }}
            onClick={scrollToTop}
          >
            <AiOutlineUp className="w-5 h-5" />
          </button>
        )} */}
      </main>

      <MobileFooter />

      {/* Footer - Hidden on mobile */}
      <footer
        className="hidden sm:flex w-full items-center justify-center py-3 px-4 text-center text-sm flex-wrap gap-2 shadow-lg touch-manipulation overscroll-none"
        style={{
          background: "linear-gradient(to top, #0d7a68 0%, #0d7a68 80%, white 10%, white 100%)",
          borderRadius: "10px 10px 0 0",
          borderTop: "2px solid rgba(0, 0, 0, 0.1)",
        }}
      >
        <Link
          isExternal
          className="flex items-center gap-1 text-white"
          href="/"
          title="Omelette's"
        >
          <span>Powered by</span>
          <p>Omelette<span className="text-[#E43636]">'</span>s</p>
        </Link>
        <span className="mx-1 text-white">|</span>
        <span className="text-white">Copyright © 2023-2025 </span>
        <span className="mx-1 text-white">|</span>
        <span className="text-white">Version 0.0.1</span>
      </footer>
    </div>
  );
}