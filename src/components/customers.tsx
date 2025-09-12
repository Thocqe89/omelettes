import { motion, Variants } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { FaPaperPlane, FaStar, FaUsers, FaGift, FaClock, FaCrown, FaAward, FaShieldAlt, FaGem } from "react-icons/fa";

export default function OMS_Special_Customers() {
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  // Animation variants with proper TypeScript typing
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.5
      }
    }
  };

  const itemVariants: Variants = {
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

  // Premium benefits icons
  const premiumIcons = ["✈️", "💎", "🌟", "👑", "🎯", "🏆", "🔒", "⭐"];

  useEffect(() => {
    // Simulate progress
    const timer = setTimeout(() => {
      setProgress(85);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 sm:py-12 bg-gradient-to-br from-[#0a2e26] via-[#0d7a68] to-[#064135] overflow-hidden relative">
      
      {/* Premium Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2220%22 height=%2220%22 viewBox=%220 0 20 20%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath d=%22M0 0h20v20H0z%22 fill=%22none%22/%3E%3Cpath d=%22M1 1v1h1v1h1v1h1v1h1v1h1v1h1v1h1v1h1v1h1v1h1v1h1v1h1v1h1v1h1v1h1v1h1v1H1z%22 fill=%22%230d7a68%22 fill-opacity=%220.03%22/%3E%3C/svg%3E')]"></div>
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {premiumIcons.map((icon, i) => (
          <motion.div
            key={i}
            className="absolute text-teal-400/10 text-3xl md:text-4xl"
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

      {/* Gold shine effect */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/5 to-transparent"
        animate={{ x: [-1000, 1000] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Main Content Container */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center text-center w-full max-w-[90vw] sm:max-w-md md:max-w-2xl mx-auto bg-gradient-to-b from-teal-900/40 to-teal-950/60 backdrop-blur-xl p-8 sm:p-10 md:p-12 rounded-3xl shadow-2xl border border-teal-600/30"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        style={{
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(13, 122, 104, 0.3)"
        }}
      >
        {/* Premium badge */}
        <motion.div 
          className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-500 to-yellow-300 text-teal-900 px-4 py-1 rounded-full font-bold text-xs flex items-center gap-1 shadow-lg"
          variants={itemVariants}
        >
          <FaGem className="text-[10px]" /> PREMIUM
        </motion.div>

        {/* Animated OMS Logo */}
        <motion.div
          className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 mb-6 relative"
          variants={itemVariants}
          animate={{
            y: [0, -5, 0],
            scale: [1, 1.05, 1],
            rotate: [0, 5, 0, -5, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-full h-full bg-gradient-to-br from-teal-700 via-teal-600 to-teal-800 rounded-2xl flex items-center justify-center p-2 shadow-lg border border-teal-500/50">
            <img 
              src="https://res.cloudinary.com/deahgtn57/image/upload/v1751616678/omelett%27s/public/image/ChatGPT_Image_Jun_29_2025_02_29_59_PM_vmvihs.png" 
              alt="OMS Logo" 
              className="w-full h-full object-contain filter drop-shadow-md"
            />
          </div>
        </motion.div>

        {/* Main Heading */}
        <motion.h1 
          className="text-3xl sm:text-4xl md:text-5xl font-bold text-teal-100 mb-4 tracking-wide"
          variants={itemVariants}
          style={{ textShadow: "0 2px 4px rgba(0,0,0,0.3)" }}
        >
          <span className="bg-gradient-to-r from-teal-300 via-yellow-300 to-teal-300 bg-clip-text text-transparent">
            OMS Elite Circle
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p 
          className="text-teal-300 text-sm mb-6 font-light tracking-wider"
          variants={itemVariants}
        >
          EXCLUSIVE MEMBERSHIP PROGRAM
        </motion.p>

        {/* Coming Soon Text */}
        <motion.div
          className="inline-flex items-center bg-gradient-to-r from-teal-700 to-teal-600 text-white px-5 py-2.5 rounded-full mb-8 gap-2 border border-teal-500/30 shadow-lg"
          variants={itemVariants}
        >
          <FaClock className="text-sm" />
          <span className="text-sm sm:text-base font-semibold tracking-wide">Launching Soon</span>
        </motion.div>

        {/* Description */}
        <motion.p 
          className="text-base sm:text-lg text-teal-200 mb-8 leading-relaxed font-light max-w-md"
          variants={itemVariants}
        >
          We are crafting an <span className="text-yellow-300 font-medium">exclusive experience</span> for our most valued customers. 
          Prepare for unparalleled access, premium benefits, and personalized service.
        </motion.p>

        {/* Benefits Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8 w-full max-w-lg"
          variants={itemVariants}
        >
          <div className="flex items-start gap-4 p-4 bg-teal-900/40 rounded-xl border border-teal-700/30 backdrop-blur-sm">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-700 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
              <FaCrown className="text-yellow-300" />
            </div>
            <div className="text-left">
              <h3 className="text-teal-100 font-medium mb-1">VIP Status</h3>
              <p className="text-teal-300 text-xs">Priority access & exclusive privileges</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-4 bg-teal-900/40 rounded-xl border border-teal-700/30 backdrop-blur-sm">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-700 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
              <FaGift className="text-red-300" />
            </div>
            <div className="text-left">
              <h3 className="text-teal-100 font-medium mb-1">Limited Editions</h3>
              <p className="text-teal-300 text-xs">Exclusive models & collectibles</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-4 bg-teal-900/40 rounded-xl border border-teal-700/30 backdrop-blur-sm">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-700 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
              <FaAward className="text-blue-300" />
            </div>
            <div className="text-left">
              <h3 className="text-teal-100 font-medium mb-1">Elite Rewards</h3>
              <p className="text-teal-300 text-xs">Enhanced loyalty benefits</p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-4 bg-teal-900/40 rounded-xl border border-teal-700/30 backdrop-blur-sm">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-700 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
              <FaShieldAlt className="text-teal-300" />
            </div>
            <div className="text-left">
              <h3 className="text-teal-100 font-medium mb-1">Dedicated Support</h3>
              <p className="text-teal-300 text-xs">Personalized customer service</p>
            </div>
          </div>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div 
          className="w-full max-w-md mb-8"
          variants={itemVariants}
        >
          <div className="flex justify-between text-xs text-teal-300 mb-3">
            <span className="font-medium">Program Development</span>
            <span className="font-semibold text-teal-200">{progress}%</span>
          </div>
          <div className="bg-teal-900/60 rounded-full h-2.5 overflow-hidden shadow-inner">
            <motion.div 
              className="bg-gradient-to-r from-teal-500 to-teal-400 h-full rounded-full relative"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ 
                duration: 2, 
                delay: 1,
                ease: "easeOut"
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/10 w-1/2"></div>
            </motion.div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="flex flex-col items-center justify-center gap-3 text-sm text-teal-300"
          variants={itemVariants}
        >
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></span>
            <span>Be the first to know when we launch</span>
          </div>
          <motion.button
            className="px-6 py-2.5 bg-gradient-to-r from-teal-700 to-teal-600 hover:from-teal-600 hover:to-teal-500 text-white rounded-full font-medium mt-2 shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 border border-teal-500/30"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/OMS_Login')}
          >
            Join Waitlist
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-teal-400/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -80, 0],
              opacity: [0, 1, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: Math.random() * 6 + 4,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      {/* Background circles animation */}
      <motion.div
        className="absolute w-64 h-64 md:w-96 md:h-96 rounded-full bg-teal-900/10 -bottom-32 -left-32"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.2, 0.5],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div
        className="absolute w-64 h-64 md:w-96 md:h-96 rounded-full bg-teal-800/10 -top-32 -right-32"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.1, 0.3],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Gold particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-yellow-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              opacity: [0, 0.7, 0],
              scale: [1, 1.5, 1]
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>
    </div>
  );
}