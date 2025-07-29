import { useState } from "react";
import { motion } from "framer-motion";
import { Image } from "@heroui/image"; // If using HeroUI

export default function Loading() {
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.div
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center h-screen "
      initial={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        animate={{
          scale: [1, 1.8, 1],
          backgroundColor: ["#0d7a68", "#F2F2F2FF", "#0d7a68"],
        }}
        className="w-80 h-80 rounded-full flex items-center justify-center"
        transition={{
          repeat: Infinity,
          duration: 6,
          ease: "easeInOut",
        }}
      >
        {!loaded && <span className="text-white" />}
        <Image
          isBlurred
          alt="Omellets Logo"
          className={`${loaded ? "block" : "hidden"} w-40 h-40`} // Hide until loaded
          src="https://res.cloudinary.com/deahgtn57/image/upload/v1751616678/omelett%27s/public/image/ChatGPT_Image_Jun_29_2025_02_29_59_PM_vmvihs.png"
          width={500}
          onLoad={() => setLoaded(true)}
        />
      </motion.div>
    </motion.div>
  );
}
