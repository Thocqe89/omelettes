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
  FaGlobe,
  FaCheck,
  FaChevronLeft,
  FaChevronRight,
  FaPlane,
  FaPlaneDeparture,
  FaPlaneArrival,
  FaCompass,
  FaCloud,
  FaWind
} from "react-icons/fa6";
import { MdFlight, MdLocationOn, MdSecurity, MdWorkspacePremium, MdFlightTakeoff, MdAirplanemodeActive } from "react-icons/md";
import { TbTruckDelivery, TbHeadset, TbCertificate, TbPlane, TbPlaneDeparture, TbPlaneArrival } from "react-icons/tb";
import DefaultLayout from "@/layouts/default";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function AboutPage() {
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [logos, setLogos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Swipe state for logos
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [slidesPerView, setSlidesPerView] = useState(3);
  const slideContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);

    const API_URL = import.meta.env.VITE_PRODUCT_DETAILS_API;

    fetch(`${API_URL}?nocache=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        const allProducts = data.products || [];
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
              name: p.Name || p.name || t("noLogos") || "Brand Logo",
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
  }, [t]);

  // Calculate responsive slides per view
  useEffect(() => {
    const calculateSlidesPerView = () => {
      if (typeof window === 'undefined') return 3;
      const width = window.innerWidth;
      if (width >= 1280) return 5; // xl
      if (width >= 1024) return 4; // lg
      if (width >= 768) return 3;  // md
      if (width >= 480) return 2;  // sm
      return 1; // xs - single slide for better mobile experience
    };

    const handleResize = () => {
      setSlidesPerView(calculateSlidesPerView());
      setCurrentSlide(0);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const slideWidth = 100 / slidesPerView;
  const totalSlides = Math.ceil(logos.length / slidesPerView);

  // Swipe handlers
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
    const threshold = 50;
    
    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        setCurrentSlide(prev => Math.min(prev + 1, totalSlides - 1));
      } else {
        setCurrentSlide(prev => Math.max(prev - 1, 0));
      }
    }
  }, [isDragging, startX, currentX, totalSlides]);

  const nextSlide = () => {
    setCurrentSlide(prev => prev === totalSlides - 1 ? 0 : prev + 1);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => prev === 0 ? totalSlides - 1 : prev - 1);
  };

  if (!mounted) return null;

  return (
    <DefaultLayout>
      <style>{`
        /* Enhanced Animations */
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 1; box-shadow: 0 0 20px rgba(13, 122, 104, 0.5); }
          50% { opacity: 0.8; box-shadow: 0 0 40px rgba(163, 217, 165, 0.7); }
        }

        @keyframes shimmer {
          0% { background-position: -1000px 0; }
          100% { background-position: 1000px 0; }
        }

        .animate-float {
          animation: float 6s ease-in-out infinite;
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .animate-shimmer {
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(255,255,255,0.1) 50%, 
            transparent 100%);
          background-size: 1000px 100%;
          animation: shimmer 3s infinite linear;
        }

        /* Modern Glass Effect */
        .glass-effect {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        .glass-effect-dark {
          background: rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        /* Gradient Text */
        .gradient-text {
          background: linear-gradient(135deg, #ffffff 0%, #A3D9A5 50%, #0d7a68 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .gradient-text-primary {
          background: linear-gradient(135deg, #0d7a68 0%, #A3D9A5 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        /* Swipe container */
        .swipe-container {
          transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          user-select: none;
          touch-action: pan-y;
        }

        .swipe-container.dragging {
          transition: none;
        }

        /* Logo card */
        .logo-card {
          background: white;
          border-radius: 16px;
          padding: 20px;
          border: 1px solid rgba(13, 122, 104, 0.1);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }

        .logo-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 40px rgba(13, 122, 104, 0.15);
          border-color: rgba(13, 122, 104, 0.3);
        }

        .logo-card.dark {
          background: #1f2937;
          border-color: rgba(255, 255, 255, 0.1);
        }

        /* Runway effect */
        .runway-line {
          position: relative;
          overflow: hidden;
        }

        .runway-line::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(163, 217, 165, 0.8) 50%, 
            transparent 100%);
          transform: translateX(-100%);
          animation: runway-shimmer 3s infinite linear;
        }

        @keyframes runway-shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 6px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(13, 122, 104, 0.1);
          border-radius: 10px;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #0d7a68, #A3D9A5);
          border-radius: 10px;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .logo-card {
            padding: 16px;
          }
        }

        /* Plane animation */
        @keyframes plane-fly {
          0% { transform: translateX(-100px) translateY(0) rotate(0deg); }
          25% { transform: translateX(25vw) translateY(-20px) rotate(5deg); }
          50% { transform: translateX(50vw) translateY(0) rotate(0deg); }
          75% { transform: translateX(75vw) translateY(-20px) rotate(-5deg); }
          100% { transform: translateX(100vw) translateY(0) rotate(0deg); }
        }

        @media (max-width: 768px) {
          @keyframes plane-fly {
            0% { transform: translateX(-50px) translateY(0) rotate(0deg); }
            25% { transform: translateX(25vw) translateY(-10px) rotate(5deg); }
            50% { transform: translateX(50vw) translateY(0) rotate(0deg); }
            75% { transform: translateX(75vw) translateY(-10px) rotate(-5deg); }
            100% { transform: translateX(100vw) translateY(0) rotate(0deg); }
          }
        }
      `}</style>

      {/* ================= MODERN HERO SECTION ================= */}
      <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-900 via-[#0a6455] to-emerald-900">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Sky Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-sky-900/80 via-[#0a6455]/90 to-emerald-900/80"></div>
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
                                linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }}
          />

          {/* Cloud Elements */}
          {[1, 2, 3].map((cloud) => (
            <motion.div
              key={cloud}
              className="absolute w-40 h-20 md:w-64 md:h-32 bg-white/5 rounded-full blur-2xl"
              animate={{
                x: [0, 100, 0],
                opacity: [0.05, 0.1, 0.05]
              }}
              transition={{
                duration: 30 + cloud * 10,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                left: `${cloud * 30}%`,
                top: `${cloud * 20}%`
              }}
            />
          ))}
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="min-h-screen flex flex-col justify-center items-center py-12 sm:py-20">
            {/* Runway Line Effect */}
            <div className="relative w-full max-w-4xl lg:max-w-6xl mb-8 sm:mb-12">
              <div className="runway-line h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-[#0d7a68] to-[#A3D9A5] animate-pulse-glow"></div>
              </div>
            </div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-6 sm:mb-8"
            >
              {/* Animated Title */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6">
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="block text-white mb-1 sm:mb-2"
                >
                  Omelette
                  <motion.span
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="inline-block text-[#fd0d0d] mx-1 sm:mx-2"
                  >
                    '
                  </motion.span>
                  s
                </motion.span>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 md:gap-4 mt-2 sm:mt-4"
                >
                  <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/90">ELEVATING</span>
                  <motion.span
                    animate={{ 
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity 
                    }}
                    className="gradient-text text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold px-3 py-1 sm:px-4 sm:py-2 rounded-lg bg-gradient-to-r from-[#0d7a68]/20 to-[#A3D9A5]/20 border border-white/10"
                  >
                    {t("oms")}
                  </motion.span>
                  <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/90">PASSION</span>
                </motion.div>
              </h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-sm sm:text-base md:text-lg lg:text-xl text-white/80 max-w-2xl lg:max-w-3xl mx-auto mt-4 sm:mt-6 leading-relaxed px-4"
              >
                {t("subtitle") || "Where aviation passion meets exquisite craftsmanship. Premium aircraft models that capture the spirit of flight with meticulous detail and authentic heritage."}
              </motion.p>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 sm:mt-12 w-full sm:w-auto"
            >
              <Link
                to="/Omelette's"
              >
                <Button
                  size="lg"
                  className="group relative overflow-hidden bg-gradient-to-r from-[#0d7a68] via-[#0d7a68] to-[#A3D9A5] text-white font-bold px-6 py-5 sm:px-8 sm:py-6 rounded-xl text-base sm:text-lg hover:shadow-xl hover:shadow-[#0d7a68]/30 transition-all duration-300 w-full sm:w-auto"
                >
                <div className="absolute inset-0 animate-shimmer"></div>
                <div className="relative flex items-center justify-center sm:justify-start gap-2 sm:gap-3">
                  <FaPlaneDeparture className="text-lg sm:text-xl group-hover:rotate-12 transition-transform duration-300" />
                  <span>{t("exploreButton") || "Explore Collection"}</span>
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block"
                  >
                    →
                  </motion.div>
                </div>
              </Button>
              </Link>
              
              {/* <Button
                size="lg"
                variant="bordered"
                className="group glass-effect text-white font-bold px-6 py-5 sm:px-8 sm:py-6 rounded-xl text-base sm:text-lg hover:bg-white/5 border-white/20 hover:border-[#A3D9A5]/50 transition-all duration-300 w-full sm:w-auto"
              >
                <div className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3">
                  <MdLocationOn className="text-lg sm:text-xl group-hover:scale-110 transition-transform" />
                  <span>{t("visitButton") || "Visit Showroom"}</span>
                </div>
              </Button> */}
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 sm:mt-12 md:mt-16 w-full max-w-4xl"
            >
              {[
                { icon: <FaPlane />, value: "500+", label: t("models_and_collectors") || "Models" },
                { icon: <FaUsers />, value: "50+", label: t("collectors_and_models") || "Collectors" },
                { icon: <FaAward />, value: "4.9★", label: t("rating") || "Rating" },
                { icon: <FaGlobe />, value: "5+", label: t("countries") || "Countries" }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="glass-effect rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center"
                >
                  <div className="text-xl sm:text-2xl md:text-3xl text-[#A3D9A5] mb-2">{stat.icon}</div>
                  <div className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-white/70">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Scroll Indicator */}
            {/* <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: 2 }}
              className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2"
            >
              <div className="flex flex-col items-center">
                <span className="text-xs sm:text-sm text-white/50 mb-2 sm:mb-3">{t("scrollIndicator") || "Scroll to Discover"}</span>
                <div className="w-5 h-8 sm:w-6 sm:h-10 border border-white/20 rounded-full flex justify-center">
                  <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-1 h-2 sm:h-3 bg-gradient-to-b from-[#A3D9A5] to-[#0d7a68] rounded-full mt-2"
                  />
                </div>
              </div>
            </motion.div> */}
          </div>
        </div>
      </section>

      {/* ================= RESPONSIVE STATS SECTION ================= */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#0d7a68]/10 to-[#A3D9A5]/10 dark:from-[#0d7a68]/20 dark:to-[#A3D9A5]/20 rounded-xl sm:rounded-2xl mb-4 sm:mb-6">
              <FaAward className="text-lg sm:text-xl md:text-2xl text-[#0d7a68] dark:text-[#A3D9A5]" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              <span className="gradient-text-primary">{t("title_desc") || "Our Journey in Numbers"}</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
              {t("subtitle_desc") || "Years of excellence, countless satisfied collectors, and a growing community of aviation enthusiasts"}
            </p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {[
              { 
                icon: <FaRocket className="text-lg sm:text-xl md:text-2xl" />, 
                value: "100+",
                label: t("modelsSold") || "Models Sold",
                description: t("modelsSoldDesc") || "Premium Collectibles"
              },
              { 
                icon: <FaUsers className="text-lg sm:text-xl md:text-2xl" />, 
                value: "98%",
                label: t("happyClients") || "Happy Clients",
                description: t("happyClientsDesc") || "Worldwide"
              },
              { 
                icon: <FaStar className="text-lg sm:text-xl md:text-2xl" />, 
                value: "4.9★",
                label: t("qualityRating") || "Quality Rating",
                description: t("qualityRatingDesc") || "Customer Satisfaction"
              },
              { 
                icon: <FaHandshake className="text-lg sm:text-xl md:text-2xl" />, 
                value: "50+",
                label: t("brandPartners") || "Brand Partners",
                description: t("brandPartnersDesc") || "Global Network"
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="relative group"
              >
                <Card className="border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm overflow-hidden h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[#0d7a68]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <CardBody className="p-4 sm:p-6 md:p-8 text-center relative z-10">
                    <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br from-[#0d7a68]/10 to-[#A3D9A5]/10 dark:from-[#0d7a68]/20 dark:to-[#A3D9A5]/20 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 md:mb-6">
                      <div className="text-[#0d7a68] dark:text-[#A3D9A5]">
                        {item.icon}
                      </div>
                    </div>
                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1 sm:mb-2">
                      {item.value}
                    </div>
                    <div className="text-base sm:text-lg md:text-xl font-semibold text-gray-800 dark:text-gray-200 mb-1 sm:mb-2">
                      {item.label}
                    </div>
                    <div className="text-xs sm:text-sm md:text-base text-gray-500 dark:text-gray-400">
                      {item.description}
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= RESPONSIVE LOGO SECTION ================= */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-800/50 dark:to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-[#0d7a68]/10 to-[#A3D9A5]/10 dark:from-[#0d7a68]/20 dark:to-[#A3D9A5]/20 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 md:mb-6">
              <FaHandshake className="text-lg sm:text-xl md:text-2xl text-[#0d7a68] dark:text-[#A3D9A5]" />
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              {t("title_logos") || "Our Trusted Partners & Brands"}
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
              {t("subtitle_logos") || "Collaborating with industry leaders and premium brands to deliver exceptional aviation collectibles"}
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center h-32 sm:h-40 md:h-48">
              <div className="animate-pulse flex space-x-4 sm:space-x-6 md:space-x-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 bg-gray-200 dark:bg-gray-700 rounded-lg sm:rounded-xl md:rounded-2xl"></div>
                ))}
              </div>
            </div>
          ) : logos.length === 0 ? (
            <div className="text-center py-8 sm:py-12 md:py-16">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gray-100 dark:bg-gray-800 rounded-xl sm:rounded-2xl mb-3 sm:mb-4 md:mb-6">
                <FaGlobe className="text-lg sm:text-xl md:text-2xl text-gray-400" />
              </div>
              <p className="text-sm sm:text-base md:text-lg text-gray-500 dark:text-gray-400">
                {t("noLogos") || "No partner logos available"}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop: Auto-scrolling */}
              <div className="hidden lg:block relative overflow-hidden">
                <div className="absolute left-0 top-0 h-full w-16 sm:w-24 md:w-32 bg-gradient-to-r from-white dark:from-gray-900 to-transparent z-10" />
                <div className="absolute right-0 top-0 h-full w-16 sm:w-24 md:w-32 bg-gradient-to-l from-white dark:from-gray-900 to-transparent z-10" />
                
                <motion.div
                  animate={{ x: [0, -1000] }}
                  transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                  className="flex space-x-6 sm:space-x-8 md:space-x-12 py-4 sm:py-6 md:py-8"
                >
                  {[...logos, ...logos].map((item, index) => (
                    <div key={index} className="flex-shrink-0">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="logo-card dark:bg-gray-800 w-32 h-32 sm:w-36 sm:h-36 md:w-40 md:h-40 lg:w-48 lg:h-48"
                      >
                        <img
                          src={item.logo}
                          alt={item.name}
                          className="w-full h-full object-contain p-2 sm:p-3 md:p-4"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.parentElement!.innerHTML = `
                              <div class="w-full h-full flex items-center justify-center p-4">
                                <span class="text-xs sm:text-sm text-gray-500 text-center break-words">${item.name}</span>
                              </div>
                            `;
                          }}
                        />
                      </motion.div>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Mobile & Tablet: Swipeable Carousel */}
              <div className="lg:hidden relative">
                <div className="overflow-hidden px-10">
                  <div 
                    ref={slideContainerRef}
                    className={`swipe-container flex ${isDragging ? 'dragging' : ''}`}
                    style={{ transform: `translateX(-${currentSlide * (100 / slidesPerView)}%)` }}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    {logos.map((item, index) => (
                      <div 
                        key={index}
                        className="flex-shrink-0 px-2"
                        style={{ width: `${100 / slidesPerView}%` }}
                      >
                        <motion.div 
                          whileTap={{ scale: 0.95 }}
                          className="flex flex-col items-center"
                        >
                          <div className="logo-card dark:bg-gray-800 w-full h-40 flex items-center justify-center">
                            <img
                              src={item.logo}
                              alt={item.name}
                              className="w-full h-full object-contain p-4"
                              loading="lazy"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                target.parentElement!.innerHTML = `
                                  <div class="w-full h-full flex items-center justify-center">
                                    <span class="text-sm text-gray-500 text-center">${item.name}</span>
                                  </div>
                                `;
                              }}
                            />
                          </div>
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white text-center mt-2 px-1 truncate w-full">
                            {item.name}
                          </h3>
                        </motion.div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dots Indicator */}
                {totalSlides > 1 && (
                  <div className="flex justify-center mt-6 space-x-2">
                    {Array.from({ length: totalSlides }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          index === currentSlide 
                            ? 'w-6 bg-gradient-to-r from-[#0d7a68] to-[#A3D9A5]' 
                            : 'w-2 bg-gray-300 dark:bg-gray-600'
                        }`}
                        aria-label={t("slideIndicator") || `Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                )}

                {/* Swipe Hint */}
                <div className="text-center mt-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t("swipeHint") || "← Swipe →"}
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
            className="mt-8 sm:mt-12 md:mt-16"
          >
            <Divider className="mb-6 sm:mb-8 md:mb-12" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {[
                { icon: <FaCheck className="text-base sm:text-lg" />, title: t("qualityAssured") || "Quality Assured", desc: t("qualityAssuredDesc") || "Premium Standards" },
                { icon: <MdSecurity className="text-base sm:text-lg" />, title: t("secure_partner") || "Secure", desc: t("secureDesc") || "Trusted Partnerships" },
                { icon: <FaHandshake className="text-base sm:text-lg" />, title: t("reliable") || "Reliable", desc: t("reliableDesc") || "Long-term Relations" },
                { icon: <FaStar className="text-base sm:text-lg" />, title: t("exclusive") || "Exclusive", desc: t("exclusiveDesc") || "Limited Partnerships" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className="text-center p-3 sm:p-4 md:p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl sm:rounded-2xl border border-gray-100 dark:border-gray-700"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gradient-to-br from-[#0d7a68]/10 to-[#A3D9A5]/10 dark:from-[#0d7a68]/20 dark:to-[#A3D9A5]/20 rounded-lg sm:rounded-xl flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4">
                    <div className="text-[#0d7a68] dark:text-[#A3D9A5]">
                      {item.icon}
                    </div>
                  </div>
                  <h4 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-1 sm:mb-2">
                    {item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= RESPONSIVE MISSION & VISION ================= */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12 md:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
              {t("title_purpose") || "Our Purpose & Promise"}
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
              {t("subtitle_purpose") || "Driving passion for aviation through exceptional craftsmanship and authentic experiences"}
            </p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <Tabs 
              aria-label="Mission and Vision" 
              className="mb-6 sm:mb-8 md:mb-12"
              classNames={{
                tabList: "bg-gray-100 dark:bg-gray-800 p-1 rounded-xl sm:rounded-2xl overflow-hidden",
                cursor: "bg-gradient-to-r from-[#0d7a68] to-[#A3D9A5] rounded-lg sm:rounded-xl",
                tab: "data-[selected=true]:text-white text-sm sm:text-base md:text-lg font-semibold",
              }}
            >
              <Tab 
                key="mission" 
                title={
                  <div className="flex items-center gap-2 sm:gap-3 px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-[#0d7a68]/20 to-[#A3D9A5]/20 rounded-lg flex items-center justify-center">
                      <FaRocket className="text-[#0d7a68] dark:text-[#A3D9A5] text-sm sm:text-base" />
                    </div>
                    <span className="text-sm sm:text-base">{t("tabTitle") || "Our Mission"}</span>
                  </div>
                }
              >
                <Card className="border-none shadow-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 mt-3 sm:mt-4 md:mt-6 overflow-hidden">
                  <CardBody className="p-4 sm:p-6 md:p-8 lg:p-12">
                    <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
                      <div>
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 md:mb-6">
                          {t("title_mission") || "To Inspire Aviation Passion"}
                        </h3>
                        <ul className="space-y-2 sm:space-y-3 md:space-y-4">
                          {(t("points", { returnObjects: true }) as string[] || [
                            "Deliver premium, authentic aircraft models",
                            "Foster a global community of aviation enthusiasts",
                            "Maintain uncompromising quality standards",
                            "Provide exceptional customer experiences",
                            "Promote aviation heritage and innovation"
                          ]).map((item: string, i: number) => (
                            <li key={i} className="flex items-start gap-2 sm:gap-3">
                              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-br from-[#0d7a68]/10 to-[#A3D9A5]/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-1">
                                <FaCheck className="text-xs text-[#0d7a68] dark:text-[#A3D9A5]" />
                              </div>
                              <span className="text-sm sm:text-base text-gray-700 dark:text-gray-300">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="relative mt-4 sm:mt-6 md:mt-0">
                        <div className="aspect-video w-full rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
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
                  <div className="flex items-center gap-2 sm:gap-3 px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-[#A3D9A5]/20 to-[#0d7a68]/20 rounded-lg flex items-center justify-center">
                      <FaGlobe className="text-[#0d7a68] dark:text-[#A3D9A5] text-sm sm:text-base" />
                    </div>
                    <span className="text-sm sm:text-base">{t("tabTitle_vision") || "Our Vision"}</span>
                  </div>
                }
              >
                <Card className="border-none shadow-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 mt-3 sm:mt-4 md:mt-6 overflow-hidden">
                  <CardBody className="p-4 sm:p-6 md:p-8 lg:p-12">
                    <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center">
                      <div className="order-2 md:order-1">
                        <div className="aspect-video w-full rounded-xl sm:rounded-2xl overflow-hidden shadow-lg">
                          <Image
                            src="https://res.cloudinary.com/deahgtn57/image/upload/v1749979221/omelett%27s/public/image/free/3_jgef5j.png"
                            alt="Vision"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      <div className="order-1 md:order-2">
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4 md:mb-6">
                          {t("title_vision") || "Global Aviation Leadership"}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-3 sm:mb-4 md:mb-6">
                          {t("description") || "To become the world's most trusted destination for premium aviation collectibles, setting new standards for quality, authenticity, and customer experience in the global collectibles market."}
                        </p>
                        <div className="bg-gradient-to-r from-[#0d7a68]/5 to-transparent dark:from-[#0d7a68]/10 border-l-4 border-[#0d7a68] dark:border-[#A3D9A5] p-3 sm:p-4 rounded-r-lg">
                          <p className="italic text-sm sm:text-base text-gray-700 dark:text-gray-300">
                            "{t("quote_subtitle") || "Where every model tells a story, and every collector becomes part of aviation history."}"
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

      {/* ================= RESPONSIVE CTA SECTION ================= */}
  <section className="py-24 bg-gradient-to-r from-[#0d7a68] to-[#0a6455] relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl mb-4 sm:mb-6">
              <MdFlight className="text-xl sm:text-2xl text-white" />
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
              {t("title_start") || "Ready to Start Your Aviation Collection?"}
            </h2>
            
            <p className="text-sm sm:text-base md:text-lg text-white/90 mb-6 sm:mb-8 px-4">
              {t("subtitle_start") || "Join thousands of satisfied collectors who trust Omelette's for premium aviation models and exceptional customer experience."}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 sm:mb-8 md:mb-12">
               <Link
                to="/help">
              <Button 
                size="lg"
                className="bg-white text-[#0d7a68] font-bold px-5 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6 rounded-xl hover:scale-105 transition-transform text-sm sm:text-base w-full sm:w-auto"
              >
                <TbHeadset className="mr-2 text-xs sm:text-sm" />
                {t("contactButton") || "Contact Expert"}
              </Button>
              </Link>
              {/* <Button 
                size="lg"
                variant="bordered" 
                className="border-white/30 text-white font-bold px-5 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6 rounded-xl hover:bg-white/10 text-sm sm:text-base w-full sm:w-auto"
              >
                <TbHeadset className="mr-2 text-xs sm:text-sm" />
                {t("contactButton") || "Contact Expert"}
              </Button> */}
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-2xl mx-auto px-2">
              {[
                { label: t("trustIndicators.securePayment") || "Secure Payment", icon: <MdSecurity className="text-sm sm:text-base" /> },
                { label: t("trustIndicators.freeShipping") || "Free Shipping*", icon: <TbTruckDelivery className="text-sm sm:text-base" /> },
                { label: t("trustIndicators.support24_7") || "24/7 Support", icon: <TbHeadset className="text-sm sm:text-base" /> },
                { label: t("trustIndicators.authenticity") || "Authenticity", icon: <TbCertificate className="text-sm sm:text-base" /> },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-1 sm:gap-2 justify-center text-white/80">
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