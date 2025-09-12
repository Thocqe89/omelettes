import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { FaPaperPlane } from "react-icons/fa";

export default function OMS_Trip_Tracker() {
  const [isLoading, setIsLoading] = useState(true);
  const logos = [
    "https://res.cloudinary.com/deahgtn57/image/upload/v1757230875/omelett%27s/public/logo/oms-t-logo/oms-t-dark_nhaye9.png",
    "https://res.cloudinary.com/deahgtn57/image/upload/v1757230873/omelett%27s/public/logo/oms-t-logo/oms-t_llufta.png",
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen 
                      bg-gradient-to-br from-[#301934] via-[#4B306E] to-[#1A0E2F] 
                      relative overflow-hidden px-4">
        
        {/* Responsive animated background elements */}
        <motion.div
          className="absolute w-40 h-40 md:w-64 md:h-64 rounded-full bg-purple-700/10"
          animate={{
            x: [-50, 50, -50],
            y: [0, 30, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        
        <motion.div
          className="absolute w-32 h-32 md:w-48 md:h-48 rounded-full bg-indigo-600/10"
          animate={{
            x: [50, -50, 50],
            y: [30, 0, 30],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Main loading content */}
        <div className="relative z-10 flex flex-col items-center w-full max-w-md">
          {/* Responsive loading spinner */}
          <motion.div
            className="w-12 h-12 md:w-16 md:h-16 border-4 border-purple-500 border-t-transparent rounded-full mb-4 md:mb-6"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Loading text with typing animation */}
          <div className="text-center w-full">
            <motion.h2
              className="text-xl md:text-2xl font-bold text-purple-300 mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              OMS Trip Tracker
            </motion.h2>
            
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-purple-200 font-semibold text-base md:text-lg inline-block">
                Loading
              </p>
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="ml-1"
              >
                ...
              </motion.span>
            </motion.div>
          </div>

          {/* Responsive progress bar */}
          <motion.div
            className="w-48 h-1.5 md:w-64 md:h-2 bg-purple-900 rounded-full mt-6 md:mt-8 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              className="h-full bg-purple-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 3, ease: "easeInOut" }}
            />
          </motion.div>

          {/* Responsive coming soon message */}
          <motion.div
            className="mt-6 md:mt-8 p-3 md:p-4 border border-purple-500/30 rounded-lg bg-purple-900/20 backdrop-blur-sm w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <motion.p
              className="text-purple-300 text-xs md:text-sm text-center flex items-center justify-center gap-2"
              animate={{ 
                color: ["#D8B4FE", "#C084FC", "#A855F7"],
              }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            >
              <FaPaperPlane className="text-sm md:text-base" /> 
              <span>Coming Soon: Advanced Trip Tracking Features</span>
            </motion.p>
          </motion.div>
        </div>

        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 md:w-2 md:h-2 bg-purple-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen 
                    bg-gradient-to-br from-[#301934] via-[#4B306E] to-[#1A0E2F] 
                    relative overflow-hidden px-4 py-8">
      
      {/* Responsive animated radial */}
      <motion.div
        className="absolute w-64 h-64 md:w-96 md:h-96 rounded-full bg-purple-900/20"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.2, 0.5],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative flex items-center justify-center mb-4 md:mb-0">
        {/* Responsive animated circle */}
        <motion.div
          className="absolute rounded-full border-4"
          style={{ 
            width: '120px', 
            height: '120px',
            borderColor: "#7B5FA5",
          }}
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.8, 0.2, 0.8],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Responsive logos */}
        <div className="relative w-24 h-24 md:w-32 md:h-32">
          {logos.map((src, index) => (
            <motion.img
              key={index}
              src={src}
              alt="OMS Logo"
              className="absolute inset-0 w-full h-full object-contain"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0.8, 1.1, 0.8],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 2,
              }}
            />
          ))}
        </div>
      </div>
      <div></div>

      {/* Responsive coming soon message */}
      <motion.div
        className="mt-4 p-4 border border-purple-500/50 rounded-xl bg-gradient-to-r from-purple-900/30 to-indigo-900/30 backdrop-blur-md w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7 }}
      >
        <motion.h3 
          className="text-purple-200 font-bold text-center mb-2 flex items-center justify-center gap-2 text-lg md:text-xl"
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <FaPaperPlane /> Coming Soon
        </motion.h3>
        <p className="text-purple-300 text-xs md:text-sm text-center">
          Advanced trip tracking features are currently in development. 
          Stay tuned for real-time tracking, analytics, and more!
        </p>
      </motion.div>

      {/* Title for mobile */}
      <motion.h2
        className="mt-6 text-xl md:text-2xl font-bold text-purple-300 md:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        OMS<span className="text-white">-</span> Trip<span className="text-white">-</span> Tracker
      </motion.h2>
    </div>
  );
}