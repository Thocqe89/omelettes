import { useTranslation } from "react-i18next";
import { Image } from "@heroui/image";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Tabs, Tab } from "@heroui/tabs";
import { Divider } from "@heroui/divider";
import { useEffect, useState, useRef, useCallback } from "react";
import {
  FaRocket,
  FaUsers,
  FaAward,
  FaHandshake,
  FaStar,
  FaHeart,
  FaGlobe,
  FaCheck,
  FaChevronLeft,
  FaChevronRight
} from "react-icons/fa6";
import { MdFlight, MdLocationOn, MdSecurity, MdWorkspacePremium } from "react-icons/md";
import { TbTruckDelivery, TbHeadset, TbCertificate } from "react-icons/tb";
import DefaultLayout from "@/layouts/default";
import { motion } from "framer-motion";

export default function AboutPage() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [logos, setLogos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  // Text animation states
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  
  // Mobile swipe state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(2);
  const slideContainerRef = useRef<HTMLDivElement>(null);

  // Hero text for typewriter effect
  const heroText = {
    line1: "Omelette's",
    line2: "Elevating Aviation Passion"
  };

  useEffect(() => {
    setMounted(true);

    const API_URL = import.meta.env.VITE_PRODUCT_DETAILS_API;

    fetch(`${API_URL}?nocache=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        const allProducts = data.products || [];
        console.log("ALL PRODUCTS FROM API:", allProducts);

        const allLogos: any[] = allProducts
          .map((p: any) => {
            const logo =
              p.Logo?.trim() ||
              p.logo?.trim() ||
              p.Image?.trim() ||
              p.image?.trim() ||
              "";
            if (!logo) return null;
            return {
              logo,
              name: p.Name || p.name || "Brand Logo",
              type: p.Type || "Product",
              rating: p.Rating || 4,
            };
          })
          .filter(Boolean);

        setLogos(allLogos);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Logo API error:", err);
        setLoading(false);
      });
  }, []);

  // Typewriter effect
  useEffect(() => {
    if (!mounted) return;

    const fullText = heroText.line1 + "\n" + heroText.line2;
    
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + fullText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 50); // Adjust typing speed here

      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
      // Blinking cursor effect
      const cursorInterval = setInterval(() => {
        setShowCursor(prev => !prev);
      }, 500);
      
      return () => clearInterval(cursorInterval);
    }
  }, [currentIndex, mounted]);

  // Calculate responsive slides per view
  useEffect(() => {
    const calculateSlidesPerView = () => {
      if (typeof window === 'undefined') return 2;
      const width = window.innerWidth;
      if (width >= 1024) return 5; // lg
      if (width >= 768) return 4;  // md
      if (width >= 640) return 3;  // sm
      return 2; // xs
    };

    const handleResize = () => {
      setSlidesPerView(calculateSlidesPerView());
      setCurrentSlide(0);
    };

    // Set initial value
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalSlides = Math.max(1, Math.ceil(logos.length / slidesPerView));

  // Handle swipe events
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    setCurrentX(e.touches[0].clientX);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    setCurrentX(e.touches[0].clientX);
  }, [isDragging]);

  const handleTouchEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const diff = startX - currentX;
    const threshold = 50; // Minimum swipe distance
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0 && currentSlide < totalSlides - 1) {
        // Swipe left
        setCurrentSlide(prev => Math.min(prev + 1, totalSlides - 1));
      } else if (diff < 0 && currentSlide > 0) {
        // Swipe right
        setCurrentSlide(prev => Math.max(prev - 1, 0));
      }
    }
  }, [isDragging, startX, currentX, currentSlide, totalSlides]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setCurrentX(e.clientX);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    setCurrentX(e.clientX);
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const diff = startX - currentX;
    const threshold = 50;
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0 && currentSlide < totalSlides - 1) {
        setCurrentSlide(prev => Math.min(prev + 1, totalSlides - 1));
      } else if (diff < 0 && currentSlide > 0) {
        setCurrentSlide(prev => Math.max(prev - 1, 0));
      }
    }
  }, [isDragging, startX, currentX, currentSlide, totalSlides]);

  // Navigation functions
  const nextSlide = () => {
    setCurrentSlide(prev => Math.min(prev + 1, totalSlides - 1));
  };

  const prevSlide = () => {
    setCurrentSlide(prev => Math.max(prev - 1, 0));
  };

  if (!mounted) return null;

  return (
    <DefaultLayout>
      {/* Add CSS for animations and image fixes */}
      <style>{`
        @keyframes slide-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        @keyframes slide-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        
        .animate-slide-left {
          animation: slide-left 40s linear infinite;
        }
        
        .animate-slide-right {
          animation: slide-right 40s linear infinite;
        }
        
        .pause-animation:hover {
          animation-play-state: paused;
        }
        
        /* Mobile swipe container */
        .swipe-container {
          transition: transform 0.3s ease-out;
          user-select: none;
        }
        
        .swipe-container.dragging {
          transition: none;
        }
        
        /* Image fixes */
        img, .image-container {
          max-width: 100%;
          height: auto;
          display: block;
        }
        
        .hero-image-wrapper {
          width: 100%;
          height: auto;
          min-height: 300px;
        }
        
        /* Prevent image overflow */
        .overflow-guard {
          overflow: hidden;
          position: relative;
        }
        
        /* Aspect ratio containers */
        .aspect-video {
          aspect-ratio: 16 / 9;
        }
        
        .aspect-square {
          aspect-ratio: 1 / 1;
        }
        
        /* Smooth image loading */
        .image-loading {
          opacity: 0;
          transition: opacity 0.3s ease-in-out;
        }
        
        .image-loaded {
          opacity: 1;
        }
        
        /* Container constraints */
        .constrain-image {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }

        /* Typewriter cursor animation */
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        .typewriter-cursor {
          display: inline-block;
          width: 3px;
          height: 1em;
          background-color: white;
          margin-left: 2px;
          animation: blink 1s infinite;
        }

        /* Gradient text animation */
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .gradient-text {
          background: linear-gradient(45deg, #ffffff, #A3D9A5, #0d7a68, #ffffff);
          background-size: 300% 300%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradient-shift 3s ease infinite;
        }

        /* Floating animation */
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        /* Fade in animation */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }

        /* Glitch effect */
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }

        .glitch-text {
          position: relative;
        }

        .glitch-text::before,
        .glitch-text::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .glitch-text::before {
          left: 2px;
          text-shadow: -1px 0 red;
          animation: glitch 2s infinite linear alternate-reverse;
        }

        .glitch-text::after {
          left: -2px;
          text-shadow: 1px 0 blue;
          animation: glitch 3s infinite linear alternate-reverse;
        }

        /* Reveal animation */
        @keyframes reveal {
          0% { 
            clip-path: inset(0 100% 0 0);
            opacity: 0;
          }
          100% { 
            clip-path: inset(0 0 0 0);
            opacity: 1;
          }
        }

        .reveal-text {
          animation: reveal 1.5s cubic-bezier(0.77, 0, 0.175, 1) forwards;
        }

        /* Split text animation */
        .split-text {
          overflow: hidden;
          display: inline-block;
        }

        .split-text span {
          display: inline-block;
          transform: translateY(100%);
          animation: slideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        @keyframes slideUp {
          to {
            transform: translateY(0);
          }
        }

        /* Staggered animation for multiple spans */
        .split-text span:nth-child(1) { animation-delay: 0.1s; }
        .split-text span:nth-child(2) { animation-delay: 0.2s; }
        .split-text span:nth-child(3) { animation-delay: 0.3s; }
        .split-text span:nth-child(4) { animation-delay: 0.4s; }
        .split-text span:nth-child(5) { animation-delay: 0.5s; }
        .split-text span:nth-child(6) { animation-delay: 0.6s; }
        .split-text span:nth-child(7) { animation-delay: 0.7s; }
        .split-text span:nth-child(8) { animation-delay: 0.8s; }
        .split-text span:nth-child(9) { animation-delay: 0.9s; }
        .split-text span:nth-child(10) { animation-delay: 1.0s; }
      `}</style>

      {/* ================= ENHANCED HERO ================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0d7a68] via-[#0a6455] to-[#083d33] dark:from-[#0a6455] dark:via-[#083d33] dark:to-[#05271f] text-white">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 py-12 sm:py-16 md:py-24">
            {/* Left Content */}
            <div className="w-full lg:w-1/2 space-y-6 sm:space-y-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-full px-3 py-2 sm:px-4 sm:py-2"
              >
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <MdFlight className="text-xs sm:text-sm" />
                </div>
                <span className="text-xs sm:text-sm font-medium">Since 2023 • Premium Aviation Collectibles</span>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="space-y-3 sm:space-y-4"
              >
                {/* OPTION 1: Typewriter Effect */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight min-h-[150px] sm:min-h-[200px] md:min-h-[250px]">
                  <div className="whitespace-pre-wrap font-mono">
                    {displayedText}
                    <span className={`typewriter-cursor ${!showCursor ? 'opacity-0' : ''}`}></span>
                  </div>
                </h1>

                {/* OPTION 2: Animated Text with Gradient - Uncomment to use */}
                {/* <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                  <div className="mb-4">
                    <motion.span
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8 }}
                      className="block gradient-text"
                    >
                      Omelette<span className="text-[#E43636]">'</span>s
                    </motion.span>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 items-center">
                    <motion.span
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="block"
                    >
                      Elevating
                    </motion.span>
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ 
                        duration: 0.6, 
                        delay: 0.4,
                        type: "spring",
                        stiffness: 100
                      }}
                      className="block bg-gradient-to-r from-[#A3D9A5] to-[#0d7a68] bg-clip-text text-transparent px-2 py-1 rounded-lg"
                    >
                      Aviation
                    </motion.span>
                    <motion.span
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.6 }}
                      className="block"
                    >
                      Passion
                    </motion.span>
                  </div>
                </h1> */}

                {/* OPTION 3: Split Text Animation - Uncomment to use */}
                {/* <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                  <div className="mb-4">
                    <div className="split-text">
                      {heroText.line1.split("").map((char, index) => (
                        <span key={index} className={char === "'" ? "text-[#E43636]" : ""}>
                          {char}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="split-text">
                    {"Elevating Aviation Passion".split("").map((char, index) => (
                      <span key={index} className={char === "A" || char === "P" ? "font-extrabold" : ""}>
                        {char}
                      </span>
                    ))}
                  </div>
                </h1> */}

                {/* OPTION 4: Fade In with Stagger - Uncomment to use */}
                {/* <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-4 fade-in-up"
                  >
                    Omelette<span className="text-[#E43636]">'</span>s
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="space-y-2 fade-in-up"
                  >
                    <div className="flex items-center gap-2">
                      <span>Elevating</span>
                      <motion.span
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ 
                          duration: 0.5,
                          delay: 0.5,
                          type: "spring",
                          stiffness: 200
                        }}
                        className="text-[#A3D9A5] font-bold px-3 py-1 bg-white/10 rounded-lg animate-float"
                      >
                        Aviation
                      </motion.span>
                      <span>Passion</span>
                    </div>
                  </motion.div>
                </h1> */}

                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: isComplete ? 0.5 : 1.5 }}
                  className="text-base sm:text-lg md:text-xl opacity-90 max-w-2xl"
                >
                  {t("intro") || "Hello everyone and welcome to Omelette's. Many may wonder why our store has this name. For me, the name Omelette's is inspired by the power and excellence of world-class airlines like Emirates, which represent a grand vision in the aviation world. At Omelette's, I want to bring that concept to all of you. It's not just about ordinary toys, but about airplane models that are detailed, exquisite, and powerful for true aviation enthusiasts. Because we share the same passion for what makes aviation strong and beautiful."}
                </motion.p>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: isComplete ? 0.8 : 2 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4"
              >
                <Button 
                  size="lg"
                  className="bg-white text-[#0d7a68] font-bold px-6 py-4 sm:px-8 sm:py-6 rounded-xl hover:scale-105 transition-transform text-sm sm:text-base group"
                >
                  <motion.div
                    animate={{ rotate: [0, 10, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="mr-2"
                  >
                    <FaRocket className="text-xs sm:text-sm" />
                  </motion.div>
                  Explore Collection
                </Button>
                <Button 
                  size="lg"
                  variant="bordered" 
                  className="border-white/30 text-white font-bold px-6 py-4 sm:px-8 sm:py-6 rounded-xl hover:bg-white/10 text-sm sm:text-base group"
                >
                  <MdLocationOn className="mr-2 text-xs sm:text-sm group-hover:scale-110 transition-transform" />
                  Visit Showroom
                </Button>
              </motion.div>

              {/* Trust Badges */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: isComplete ? 1 : 2.5 }}
                className="flex flex-wrap gap-2 sm:gap-4 pt-3 sm:pt-4"
              >
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-1 sm:gap-2 bg-white/5 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 hover:bg-white/10 transition-colors"
                >
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <MdSecurity className="text-[#A3D9A5] text-sm sm:text-base" />
                  </motion.div>
                  <span className="text-xs sm:text-sm">Secure Transactions</span>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-1 sm:gap-2 bg-white/5 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 hover:bg-white/10 transition-colors"
                >
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <TbTruckDelivery className="text-[#A3D9A5] text-sm sm:text-base" />
                  </motion.div>
                  <span className="text-xs sm:text-sm">Global Shipping</span>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-1 sm:gap-2 bg-white/5 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2 hover:bg-white/10 transition-colors"
                >
                  <TbCertificate className="text-[#A3D9A5] text-sm sm:text-base" />
                  <span className="text-xs sm:text-sm">Authenticity Guaranteed</span>
                </motion.div>
              </motion.div>
            </div>

            {/* Right Image - Fixed with proper constraints */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="w-full lg:w-1/2 relative mt-8 lg:mt-0 overflow-guard"
            >
              <div className="relative group overflow-guard">
                {/* <motion.div 
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-[#A3D9A5] to-[#0d7a68] rounded-2xl sm:rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"
                ></motion.div> */}
                <div className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-xl sm:shadow-2xl">
                  <div className="aspect-video w-full">
                    <Image
                      isBlurred
                      src="https://res.cloudinary.com/deahgtn57/image/upload/v1751616678/omelett%27s/public/image/ChatGPT_Image_Jun_29_2025_02_29_59_PM_vmvihs.png"
                      alt="Omelette's Aviation Collection"
                      className={`w-full h-full object-cover transform group-hover:scale-[1.02] transition-transform duration-500 ${imageLoaded ? 'image-loaded' : 'image-loading'}`}
                      onLoad={() => setImageLoaded(true)}
                    />
                  </div>
                </div>
                {/* Optional floating element */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -bottom-2 -right-2 sm:-bottom-4 sm:-right-4 bg-gradient-to-br from-[#0d7a68] to-[#A3D9A5] text-white p-2 sm:p-4 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl"
                >
                  {/* <div className="flex items-center gap-1 sm:gap-2">
                    <MdWorkspacePremium className="text-lg sm:text-2xl" />
                    <div>
                      <p className="font-bold text-xs sm:text-sm md:text-base">Premium Collection</p>
                      <p className="text-[10px] sm:text-xs opacity-90">Since 2023</p>
                    </div>
                  </div> */}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Rest of your existing code remains the same */}
      {/* ================= ENHANCED STATS ================= */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4"
            >
              Our Journey in Numbers
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4"
            >
              Years of excellence, countless satisfied collectors, and a growing community of aviation enthusiasts
            </motion.p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 px-2 sm:px-0">
            {[
              { 
                icon: <FaRocket />, 
                label: "Models Sold", 
                value: "10K+",
                description: "Premium Collectibles"
              },
              { 
                icon: <FaUsers />, 
                label: "Happy Clients", 
                value: "3K+",
                description: "Worldwide"
              },
              { 
                icon: <FaAward />, 
                label: "Quality Rating", 
                value: "4.9★",
                description: "Customer Satisfaction"
              },
              { 
                icon: <FaHandshake />, 
                label: "Brand Partners", 
                value: "50+",
                description: "Global Network"
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true, margin: "-50px" }}
                className="h-full"
              >
                <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm h-full overflow-hidden">
                  <CardBody className="p-4 sm:p-6 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#0d7a68]/10 to-[#A3D9A5]/10 dark:from-[#0d7a68]/20 dark:to-[#A3D9A5]/20 rounded-xl sm:rounded-2xl mb-3 sm:mb-4">
                      <div className="text-xl sm:text-2xl text-[#0d7a68] dark:text-[#A3D9A5]">
                        {item.icon}
                      </div>
                    </div>
                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
                      {item.value}
                    </div>
                    <div className="text-base sm:text-lg font-semibold text-gray-800 dark:text-gray-200 mb-1">
                      {item.label}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                      {item.description}
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SWIPEABLE LOGO SECTION ================= */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#0d7a68]/10 to-[#A3D9A5]/10 dark:from-[#0d7a68]/20 dark:to-[#A3D9A5]/20 rounded-xl sm:rounded-2xl mb-3 sm:mb-4">
              <FaHandshake className="text-xl sm:text-2xl text-[#0d7a68] dark:text-[#A3D9A5]" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Our Trusted Partners & Brands
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
              Collaborating with industry leaders and premium brands to deliver exceptional aviation collectibles
            </p>
          </motion.div>

          {/* Loading State */}
          {loading ? (
            <div className="flex justify-center items-center h-32 sm:h-40">
              <div className="animate-pulse flex space-x-4 sm:space-x-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gray-200 dark:bg-gray-700 rounded-lg sm:rounded-xl overflow-hidden"></div>
                ))}
              </div>
            </div>
          ) : logos.length === 0 ? (
            <div className="text-center py-8 sm:py-12 overflow-guard">
              <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 dark:bg-gray-800 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 overflow-hidden">
                <FaGlobe className="text-xl sm:text-2xl text-gray-400" />
              </div>
              <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400">No partner logos available</p>
            </div>
          ) : (
            <>
              {/* Desktop: Auto-sliding Animation */}
              <div className="hidden lg:block relative overflow-guard">
                {/* Gradient overlays for smooth edges */}
                <div className="absolute left-0 top-0 h-full w-16 sm:w-24 bg-gradient-to-r from-gray-50 dark:from-gray-800 to-transparent z-10"></div>
                <div className="absolute right-0 top-0 h-full w-16 sm:w-24 bg-gradient-to-l from-gray-50 dark:from-gray-800 to-transparent z-10"></div>
                
                {/* First Slider (Infinite Loop) */}
                <div className="flex space-x-6 sm:space-x-8 md:space-x-10 animate-slide-left py-4">
                  {[...logos, ...logos].map((item, index) => (
                    <div key={index} className="flex-shrink-0 flex flex-col items-center justify-center w-32 sm:w-36 md:w-40">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center justify-center mb-2 sm:mb-3 group hover:bg-gradient-to-br hover:from-[#0d7a68]/5 hover:to-[#A3D9A5]/5 transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden">
                        <img
                          src={item.logo}
                          alt={item.name}
                          className="w-full h-full object-contain constrain-image group-hover:scale-110 transition-transform duration-300"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.parentElement!.innerHTML = `
                              <div class="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
                                <span class="text-gray-400 text-xs">${item.name}</span>
                              </div>
                            `;
                          }}
                        />
                      </div>
                      <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white text-center px-2 truncate w-full">
                        {item.name}
                      </h3>
                    </div>
                  ))}
                </div>

                {/* Second Slider (Reverse direction for variety) */}
                <div className="flex space-x-6 sm:space-x-8 md:space-x-10 animate-slide-right py-4 mt-6 sm:mt-8">
                  {[...logos.slice().reverse(), ...logos.slice().reverse()].map((item, index) => (
                    <div key={index} className="flex-shrink-0 flex flex-col items-center justify-center w-28 sm:w-32 md:w-36">
                      <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-2 sm:p-3 flex items-center justify-center mb-2 group hover:bg-gradient-to-br hover:from-[#0d7a68]/5 hover:to-[#A3D9A5]/5 transition-all duration-300 shadow-md hover:shadow-lg overflow-hidden">
                        <img
                          src={item.logo}
                          alt={item.name}
                          className="w-full h-full object-contain constrain-image group-hover:scale-110 transition-transform duration-300"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.parentElement!.innerHTML = `
                              <div class="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
                                <span class="text-gray-400 text-xs">${item.name}</span>
                              </div>
                            `;
                          }}
                        />
                      </div>
                      <h3 className="text-xs font-semibold text-gray-900 dark:text-white text-center px-2 truncate w-full">
                        {item.name}
                      </h3>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tablet & Mobile: Swipeable Carousel */}
              <div className="lg:hidden relative px-2 sm:px-4 overflow-guard">
                {/* Navigation Buttons */}
                {currentSlide > 0 && (
                  <button
                    onClick={prevSlide}
                    className="absolute left-0 sm:left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-colors"
                    aria-label="Previous slide"
                  >
                    <FaChevronLeft className="text-[#0d7a68] dark:text-[#A3D9A5] text-sm sm:text-base" />
                  </button>
                )}
                
                {currentSlide < totalSlides - 1 && (
                  <button
                    onClick={nextSlide}
                    className="absolute right-0 sm:right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-colors"
                    aria-label="Next slide"
                  >
                    <FaChevronRight className="text-[#0d7a68] dark:text-[#A3D9A5] text-sm sm:text-base" />
                  </button>
                )}

                {/* Swipeable Container */}
                <div 
                  ref={slideContainerRef}
                  className={`swipe-container ${isDragging ? 'dragging' : ''}`}
                  style={{
                    transform: `translateX(-${currentSlide * 100}%)`,
                    touchAction: 'pan-y pinch-zoom'
                  }}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                >
                  <div className="flex">
                    {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                      <div 
                        key={slideIndex} 
                        className="w-full flex-shrink-0 px-2"
                      >
                        <div className={`grid gap-3 sm:gap-4`} style={{
                          gridTemplateColumns: `repeat(${slidesPerView}, minmax(0, 1fr))`
                        }}>
                          {logos
                            .slice(slideIndex * slidesPerView, slideIndex * slidesPerView + slidesPerView)
                            .map((item, itemIndex) => (
                              <div key={itemIndex} className="flex flex-col items-center overflow-guard">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-2 sm:p-3 flex items-center justify-center mb-1 sm:mb-2 shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                                  <img
                                    src={item.logo}
                                    alt={item.name}
                                    className="w-full h-full object-contain constrain-image"
                                    loading="lazy"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                      target.parentElement!.innerHTML = `
                                        <div class="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg">
                                          <span class="text-gray-400 text-xs">${item.name}</span>
                                        </div>
                                      `;
                                    }}
                                  />
                                </div>
                                <h3 className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white text-center px-1 truncate w-full">
                                  {item.name}
                                </h3>
                              </div>
                            ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dots Indicator */}
                {totalSlides > 1 && (
                  <div className="flex justify-center mt-4 sm:mt-6 space-x-1 sm:space-x-2">
                    {Array.from({ length: totalSlides }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          index === currentSlide 
                            ? 'bg-[#0d7a68] dark:bg-[#A3D9A5] w-4 sm:w-6' 
                            : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 w-2'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                )}

                {/* Swipe Hint */}
                <div className="text-center mt-3 sm:mt-4 overflow-guard">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    ← Swipe or use arrows →
                  </p>
                </div>
              </div>
            </>
          )}

          {/* Partnership Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 sm:mt-16 overflow-guard"
          >
            <Divider className="mb-6 sm:mb-8" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {[
                { icon: <FaCheck />, title: "Quality Assured", desc: "Premium standards" },
                { icon: <MdSecurity />, title: "Secure", desc: "Trusted partnerships" },
                { icon: <FaHandshake />, title: "Reliable", desc: "Long-term relations" },
                { icon: <FaStar />, title: "Exclusive", desc: "Limited partnerships" },
              ].map((benefit, i) => (
                <div key={i} className="flex flex-col items-center text-center p-3 sm:p-4 overflow-guard">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-[#0d7a68]/10 to-[#A3D9A5]/10 dark:from-[#0d7a68]/20 dark:to-[#A3D9A5]/20 rounded-lg sm:rounded-xl flex items-center justify-center mb-2 sm:mb-3 overflow-hidden">
                    <div className="text-[#0d7a68] dark:text-[#A3D9A5] text-base sm:text-lg">
                      {benefit.icon}
                    </div>
                  </div>
                  <h4 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white mb-1 truncate w-full">{benefit.title}</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-300">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= ENHANCED MISSION & VISION ================= */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              Our Purpose & Promise
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
              Driving passion for aviation through exceptional craftsmanship and authentic experiences
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <Tabs 
              aria-label="Mission and Vision" 
              className="mb-8 sm:mb-12 overflow-guard"
              classNames={{
                tabList: "bg-gray-100 dark:bg-gray-800 p-1 rounded-xl sm:rounded-2xl overflow-hidden",
                cursor: "bg-gradient-to-r from-[#0d7a68] to-[#A3D9A5] rounded-lg sm:rounded-xl",
                tab: "data-[selected=true]:text-white text-base sm:text-lg font-semibold",
              }}
            >
              <Tab 
                key="mission" 
                title={
                  <div className="flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-4 sm:py-3 overflow-guard">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-[#0d7a68]/20 to-[#A3D9A5]/20 rounded-lg flex items-center justify-center overflow-hidden">
                      <FaRocket className="text-[#0d7a68] dark:text-[#A3D9A5] text-sm sm:text-base" />
                    </div>
                    <span className="text-sm sm:text-base">Our Mission</span>
                  </div>
                }
              >
                <Card className="border-none shadow-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 mt-4 sm:mt-6 overflow-hidden">
                  <CardBody className="p-4 sm:p-6 md:p-8 lg:p-12">
                    <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
                      <div className="overflow-guard">
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                          To Inspire Aviation Passion
                        </h3>
                        <ul className="space-y-3 sm:space-y-4">
                          {[
                            "Deliver premium, authentic aircraft models",
                            "Foster a global community of aviation enthusiasts",
                            "Maintain uncompromising quality standards",
                            "Provide exceptional customer experiences",
                            "Promote aviation heritage and innovation"
                          ].map((item, i) => (
                            <li key={i} className="flex items-start gap-2 sm:gap-3 overflow-guard">
                              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-[#0d7a68]/10 to-[#A3D9A5]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-1 overflow-hidden">
                                <FaCheck className="text-xs text-[#0d7a68] dark:text-[#A3D9A5]" />
                              </div>
                              <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="relative mt-6 md:mt-0 overflow-guard">
                        <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-[#0d7a68]/10 to-[#A3D9A5]/10 rounded-xl sm:rounded-3xl blur-xl"></div>
                        <div className="aspect-video w-full rounded-xl sm:rounded-2xl overflow-hidden shadow-lg relative z-10">
                          <Image
                            src="https://res.cloudinary.com/deahgtn57/image/upload/v1749979221/omelett%27s/public/image/free/2_vwhyiw.png"
                            alt="Mission"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Tab>
              
              <Tab 
                key="vision" 
                title={
                  <div className="flex items-center gap-2 sm:gap-3 px-3 py-2 sm:px-4 sm:py-3 overflow-guard">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-[#A3D9A5]/20 to-[#0d7a68]/20 rounded-lg flex items-center justify-center overflow-hidden">
                      <FaGlobe className="text-[#0d7a68] dark:text-[#A3D9A5] text-sm sm:text-base" />
                    </div>
                    <span className="text-sm sm:text-base">Our Vision</span>
                  </div>
                }
              >
                <Card className="border-none shadow-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 mt-4 sm:mt-6 overflow-hidden">
                  <CardBody className="p-4 sm:p-6 md:p-8 lg:p-12">
                    <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
                      <div className="order-2 md:order-1 overflow-guard">
                        <div className="relative">
                          <div className="absolute -inset-2 sm:-inset-4 bg-gradient-to-r from-[#A3D9A5]/10 to-[#0d7a68]/10 rounded-xl sm:rounded-3xl blur-xl"></div>
                          <div className="aspect-video w-full rounded-xl sm:rounded-2xl overflow-hidden shadow-lg relative z-10">
                            <Image
                              src="https://res.cloudinary.com/deahgtn57/image/upload/v1749979221/omelett%27s/public/image/free/3_jgef5j.png"
                              alt="Vision"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="order-1 md:order-2 overflow-guard">
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                          Global Aviation Leadership
                        </h3>
                        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-4 sm:mb-6">
                          To become the world's most trusted destination for premium aviation collectibles, 
                          setting new standards for quality, authenticity, and customer experience in the 
                          global collectibles market.
                        </p>
                        <div className="bg-gradient-to-r from-[#0d7a68]/5 to-transparent dark:from-[#0d7a68]/10 border-l-4 border-[#0d7a68] dark:border-[#A3D9A5] p-3 sm:p-4 rounded-r-lg overflow-guard">
                          <p className="italic text-sm sm:text-base text-gray-700 dark:text-gray-300">
                            "Where every model tells a story, and every collector becomes part of aviation history."
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Tab>
            </Tabs>
          </div>
        </div>
      </section>

      {/* ================= ENHANCED CTA ================= */}
      <section className="relative overflow-hidden py-12 sm:py-16 md:py-20 bg-gradient-to-r from-[#0d7a68] via-[#0a6455] to-[#083d33] dark:from-[#0a6455] dark:via-[#083d33] dark:to-[#05271f]">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto overflow-guard"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl mb-4 sm:mb-6 overflow-hidden">
              <MdFlight className="text-xl sm:text-2xl text-white" />
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              Ready to Start Your Aviation Collection?
            </h2>
            
            <p className="text-base sm:text-lg md:text-xl text-white/90 mb-6 sm:mb-8 px-4">
              Join thousands of satisfied collectors who trust Omelette's for premium aviation models 
              and exceptional customer experience.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8 sm:mb-12 overflow-guard">
              <Button 
                size="lg"
                className="bg-white text-[#0d7a68] font-bold px-6 py-4 sm:px-8 sm:py-6 rounded-xl hover:scale-105 transition-transform text-sm sm:text-base overflow-hidden"
              >
                <FaRocket className="mr-2 text-xs sm:text-sm" />
                Browse Collection
              </Button>
              <Button 
                size="lg"
                variant="bordered" 
                className="border-white/30 text-white font-bold px-6 py-4 sm:px-8 sm:py-6 rounded-xl hover:bg-white/10 text-sm sm:text-base overflow-hidden"
              >
                <TbHeadset className="mr-2 text-xs sm:text-sm" />
                Contact Expert
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto px-2 overflow-guard">
              {[
                { label: "Secure Payment", icon: <MdSecurity /> },
                { label: "Free Shipping*", icon: <TbTruckDelivery /> },
                { label: "24/7 Support", icon: <TbHeadset /> },
                { label: "Authenticity", icon: <TbCertificate /> },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-1 sm:gap-2 justify-center text-white/80 overflow-hidden">
                  {item.icon}
                  <span className="text-xs sm:text-sm truncate">{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </DefaultLayout>
  );
}