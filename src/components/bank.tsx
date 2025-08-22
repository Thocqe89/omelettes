import * as React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import DefaultLayout from "@/layouts/default";

export default function BlankPage() {
  const { t } = useTranslation();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.5
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.7,
        ease: "easeOut"
      }
    }
  };

  // Financial icons for background
  const financialIcons = ["💳", "💰", "🏦", "📈", "💵", "💎", "🔒", "📊"];

  return (
    <DefaultLayout>
      <section className="min-h-screen flex flex-col items-center justify-center px-4 py-8 sm:py-12 bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-blue-900 overflow-hidden relative">
        
        {/* Animated Financial Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {financialIcons.map((icon, i) => (
            <motion.div
              key={i}
              className="absolute text-blue-400/20 dark:text-green-400/10 text-2xl md:text-3xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.random() * 20 - 10, 0],
                rotate: [0, Math.random() * 15 - 7.5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: Math.random() * 8 + 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {icon}
            </motion.div>
          ))}
        </div>

        {/* Main Content Container */}
        <motion.div
          className="relative z-10 flex flex-col items-center justify-center text-center w-full max-w-[90vw] sm:max-w-md md:max-w-2xl mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg p-6 sm:p-8 md:p-10 rounded-2xl shadow-xl border border-blue-100 dark:border-gray-700"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Animated Bank Icon */}
          <motion.div
            className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mb-6 relative"
            variants={itemVariants}
            animate={{
              y: [0, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="w-full h-full bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center">
              <span className="text-2xl sm:text-3xl md:text-4xl"><img src="/image/menu/thl.png" alt="Bank Icon" /></span>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.h1 
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4"
            variants={itemVariants}
          >
               <p><span className="text-[#e5da02]">3 </span><span className="text-[#0d7a68]">|</span>Thee Leaves</p>
          </motion.h1>

          {/* Coming Soon Text */}
          <motion.div
            className="inline-block bg-gradient-to-r from-blue-600 to-green-600 text-white px-4 py-2 rounded-full mb-6"
            variants={itemVariants}
          >
            <span className="text-sm sm:text-base font-semibold">Coming Soon</span>
          </motion.div>

          {/* Description */}
          <motion.p 
            className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed"
            variants={itemVariants}
          >
            We're preparing something amazing for you. Our services will be available soon.
          </motion.p>

          {/* Simple Progress Indicator */}
          <motion.div 
            className="w-full max-w-xs mb-6"
            variants={itemVariants}
          >
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
              <span>Preparing...</span>
              <span className="font-semibold">65%</span>
            </div>
            <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <motion.div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-full rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "65%" }}
                transition={{ 
                  duration: 2, 
                  delay: 1,
                  ease: "easeOut"
                }}
              />
            </div>
          </motion.div>

          {/* Simple Security Note */}
          <motion.div
            className="flex items-center justify-center gap-2 text-xs sm:text-sm text-green-600 dark:text-green-400"
            variants={itemVariants}
          >
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Secure  solutions coming soon
          </motion.div>
        </motion.div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-blue-400/20 dark:bg-green-400/10 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -60, 0],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: Math.random() * 6 + 4,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            />
          ))}
        </div>
      </section>
    </DefaultLayout>
  );
}