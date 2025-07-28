import { useState, useEffect } from "react";
import { Image } from "@heroui/image"; // Assuming you're using this Image component

export default function AutoSlideshow() {
  const images = [
    "/image/home/1.png",
    "/image/home/2.png",
    "/image/home/4.png",
    "/image/home/3.png",
    "/image/home/5.png",
    "/image/home/6.png",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 2000); // 2 seconds

    return () => clearInterval(timer); // cleanup
  }, [images.length]);

  return (
    <div className="relative w-full max-w-4xl mx-auto overflow-hidden rounded-lg">
      {images.map((src, i) => (
        <div
          key={i}
          className={`transition-opacity duration-1000 ease-in-out absolute inset-0 ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            isBlurred
            isZoomed
            alt={`Slide ${i + 1}`}
            src={src}
            className="w-full h-[400px] object-cover rounded-lg"
          />
        </div>
      ))}
      {/* Optional dots */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
        {images.map((_, i) => (
          <span
            key={i}
            className={`w-3 h-3 rounded-full ${
              i === index ? "bg-white" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
