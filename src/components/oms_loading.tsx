import { motion } from "framer-motion";

export default function OMS_Loading() {
  const logos = [
    "https://res.cloudinary.com/deahgtn57/image/upload/v1757230875/omelett%27s/public/logo/oms-t-logo/oms-t-dark_nhaye9.png", // white logo
    "https://res.cloudinary.com/deahgtn57/image/upload/v1757230873/omelett%27s/public/logo/oms-t-logo/oms-t_llufta.png", // purple logo
  ];

  return (
    <div className="flex flex-col items-center justify-center h-screen 
                    bg-gradient-to-br from-[#301934] via-[#4B306E] to-[#1A0E2F] 
                    relative overflow-hidden">
      
      {/* Subtle animated radial behind logos */}
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-purple-900/20"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.2, 0.5],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative flex items-center justify-center">
        {/* Animated circle behind the logo */}
        <motion.div
          className="absolute rounded-full border-4"
          style={{ width: 160, height: 160, borderColor: "#7B5FA5" }}
          animate={{
            scale: [1, 1.6, 1], // pulsing effect
            opacity: [0.8, 0.2, 0.8],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Logos morphing */}
        <div className="relative w-32 h-32">
          {logos.map((src, index) => (
            <motion.img
              key={index}
              src={src}
              alt="OMS Logo"
              className="absolute inset-0 w-full h-full object-contain"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0.8, 1.2, 0.8],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 2, // stagger logos
              }}
            />
          ))}
        </div>
      </div>

      <motion.p
        className="mt-6 text-purple-300 font-semibold text-lg"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
      
      </motion.p>
    </div>
  );
}
