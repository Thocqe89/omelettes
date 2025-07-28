import { useState } from "react";
import { motion } from "framer-motion";
import { Image } from "@heroui/image"; // If using HeroUI

export default function Loading() {
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center h-screen "
    >
      <motion.div
        animate={{
          
          scale: [1, 1.8, 1],
          backgroundColor: ["#0d7a68", "#F2F2F2FF", "#0d7a68"],
        }}
        transition={{
          repeat: Infinity,
          duration: 6,
          ease: "easeInOut",
        }}
        className="w-80 h-80 rounded-full flex items-center justify-center"
      >
        {!loaded && <span className="text-white"></span>}
        <Image
          isBlurred
          alt="Omellets Logo"
          src="https://res.cloudinary.com/deahgtn57/image/upload/v1751616678/omelett%27s/public/image/ChatGPT_Image_Jun_29_2025_02_29_59_PM_vmvihs.png"
          width={500}
          onLoad={() => setLoaded(true)}
          className={`${loaded ? "block" : "hidden"} w-40 h-40`} // Hide until loaded
        />
      </motion.div>
    </motion.div>
  );
}
