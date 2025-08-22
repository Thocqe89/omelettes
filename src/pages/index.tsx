import { useState, useEffect } from "react";
import { Link } from "@heroui/link";
import { Image } from "@heroui/image";
import { useTranslation } from "react-i18next";
import "aos/dist/aos.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import DefaultLayout from "@/layouts/default";

interface Product {
  ID: string;
  Name: string;
  Images?: {
    image_meain?: string | null;
    image_1?: string | null;
    image_2?: string | null;
    image_3?: string | null;
    [key: string]: string | null | undefined;
  };
  Logo?: string;
}

export default function IndexPage() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentC919Index, setCurrentC919Index] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentLightboxImage, setCurrentLightboxImage] = useState("");

  const API_URL = import.meta.env.VITE_PRODUCT_DETAILS_API;

  // Fetch products from API
  useEffect(() => {
    fetch(`${API_URL}?nocache=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.products)) {
          const mapped = data.products.map((p: any) => ({
            ID: p.ID || "N/A",
            Name: p.Name || "N/A",
            Images: p.Images || {},
            Logo: p.logo || "",
          }));
          setProducts(mapped);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  // Get all valid images from a product with logo information
  function getAllImagesWithLogo(product: Product): Array<{ src: string; logo?: string }> {
    const images: Array<{ src: string; logo?: string }> = [];
    if (!product.Images) return images;

    const imageKeys = [
      "image_meain",
      "image_1",
      "image_2",
      "image_3",
      "image_4",
      "image_5",
      "image_6",
      "image_7",
      "image_8",
      "image_9",
      "image_10",
      "image_11",
      "image_12",
      "image_13",
      "image_14",
      "image_15",
    ];

    imageKeys.forEach((key) => {
      const url = product.Images?.[key];
      if (url && url.trim() !== "") {
        images.push({
          src: url.trim(),
          logo: product.Logo || undefined
        });
      }
    });

    return images;
  }

  // Get random products with images and randomly decide which ones should show logo
  function getRandomProductsWithImages(count: number): Array<{ src: string; showLogo: boolean; logo?: string }> {
    const allImages: Array<{ src: string; logo?: string }> = [];
    
    products.forEach((product) => {
      const productImages = getAllImagesWithLogo(product);
      allImages.push(...productImages);
    });

    // Shuffle and select random images
    const shuffled = [...allImages].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count).map(item => ({
      ...item,
      showLogo: Math.random() < 0.3 && !!item.logo // 30% chance to show logo if available
    }));
  }

  // C919 images
  const c919Images = [
    "https://res.cloudinary.com/deahgtn57/image/upload/v1749979263/omelett%27s/public/c919/109_sqz5zm.png",
    "https://res.cloudinary.com/deahgtn57/image/upload/v1749978988/omelett%27s/public/c919/104_kukfrn.png",
    "https://res.cloudinary.com/deahgtn57/image/upload/v1749978988/omelett%27s/public/c919/102_ifefam.png",
    "https://res.cloudinary.com/deahgtn57/image/upload/v1749978988/omelett%27s/public/c919/103_qxckbi.png",
    "https://res.cloudinary.com/deahgtn57/image/upload/v1749978989/omelett%27s/public/c919/105_xitts5.png",
    "https://res.cloudinary.com/deahgtn57/image/upload/v1749978990/omelett%27s/public/c919/107_tczxca.png",
    "https://res.cloudinary.com/deahgtn57/image/upload/v1749978989/omelett%27s/public/c919/108_yo3nlq.png",
    "https://res.cloudinary.com/deahgtn57/image/upload/v1749978990/omelett%27s/public/c919/110_boqc2i.png",
    "https://res.cloudinary.com/deahgtn57/image/upload/v1749978990/omelett%27s/public/c919/113_ieq5sv.png",
    "https://res.cloudinary.com/deahgtn57/image/upload/v1749978991/omelett%27s/public/c919/117_ainnff.png",
    "https://res.cloudinary.com/deahgtn57/image/upload/v1749978992/omelett%27s/public/c919/118_vrp2nx.png",
    "https://res.cloudinary.com/deahgtn57/image/upload/v1749978991/omelett%27s/public/c919/119_xdasto.png",
  ];

  // Generate random image list from API products
  const imageList = loading ? [] : getRandomProductsWithImages(12);

  // Manual sliding functions for C919 images
  const nextC919Slide = () => {
    setCurrentC919Index((prevIndex) => (prevIndex + 1) % c919Images.length);
  };

  const prevC919Slide = () => {
    setCurrentC919Index((prevIndex) => 
      (prevIndex - 1 + c919Images.length) % c919Images.length
    );
  };

  // Open image in lightbox
  const openLightbox = (src: string) => {
    setCurrentLightboxImage(src);
    setLightboxOpen(true);
  };

  return (
    <DefaultLayout>
      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="relative max-w-full max-h-full">
            <img
              src={currentLightboxImage}
              alt="Fullscreen view"
              className="max-w-full max-h-[90vh] object-contain cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* Hero Video Section */}
      <div className="relative w-full h-[400px] md:h-[400px] lg:h-[600px] rounded-lg overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="https://res.cloudinary.com/deahgtn57/video/upload/v1749978822/omelett%27s/20_qpukka.mp4" />
        </video>
        <div
          className="relative z-10 flex h-full w-full items-center justify-center"
          data-aos="fade-right"
          data-aos-delay="200"
          data-aos-duration="1200"
        >
          <div className="absolute w-72 h-72 rounded-full bg-white opacity-30 blur-2xl z-0" />

          <img
            key={currentC919Index}
            alt="C919 Flying"
            className="w-auto h-auto transition-opacity duration-500 z-10 max-w-[90%] animate-float-y-subtle"
            src={c919Images[currentC919Index]}
          />
        </div>

        <button
          aria-label="Previous C919 image"
          className="absolute left-2 top-[80%] transform -translate-y-1/2 bg-opacity-70 rounded-full p-2 shadow-md hover:bg-opacity-90 transition-colors z-20"
          onClick={prevC919Slide}
        >
          <FaChevronLeft className="text-green-700" />
        </button>

        <button
          aria-label="Next C919 image"
          className="absolute right-2 top-[80%] transform -translate-y-1/2 bg-opacity-70 rounded-full p-2 shadow-md hover:bg-opacity-90 transition-colors z-20"
          onClick={nextC919Slide}
        >
          <FaChevronRight className="text-green-700" />
        </button>
      </div>

      {/* Main Content Section */}
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-12 px-4">
        <div className="inline-block max-w-lg text-center justify-center">
          <p className="text-default-500 text-sm md:text-base">{t("premium_airplane_models")}</p>
        </div>
        
        <div data-aos="zoom-in">
          <div className="h-1 w-40 sm:w-60 md:w-80 mx-auto border-b-3 border-green-700" />
        </div>

        <div data-aos="zoom-out">
          <p className="text-gray-500 mt-2 text-xs sm:text-sm md:text-base text-center px-4">
            {t("authentic_image")}
          </p>
        </div>

        {/* Image Gallery */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-700"></div>
          </div>
        ) : (
         <div className="w-full max-w-7xl mx-auto">
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4 px-2 sm:px-4">
    {imageList.map((item, idx) => (
      <div 
        key={`${item.src}-${idx}`}
        className="aspect-square relative overflow-hidden"
      >
        <div onClick={() => openLightbox(item.src)} className="cursor-zoom-in h-full">
          {item.showLogo && item.logo && (
            <div className="absolute bottom-2 right-2 w-8 h-8 md:w-10 md:h-10 bg-white bg-opacity-80 rounded-full p-1 flex items-center justify-center z-10">
              <img 
                src={item.logo} 
                alt="Brand Logo" 
                className="w-full h-full object-contain"
              />
            </div>
          )}
          <Image
            isBlurred
            isZoomed
            alt={`Airplane Model ${idx + 1}`}
            className="border border-green-700 w-full h-full object-cover rounded-lg hover:scale-105 transition-transform duration-300"
            src={item.src}
            width={0}
            height={0}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            loading={idx < 6 ? "eager" : "lazy"}
            style={{
              width: '100%',
              height: '100%',
              minWidth: '100%',
              minHeight: '100%'
            }}
          />
        </div>
      </div>
    ))}
  </div>
</div>
        )}

        <div data-aos="zoom-in" className="w-full max-w-7xl mx-auto">
          <div className="h-1 w-40 sm:w-60 md:w-80 mx-auto border-b-3 border-green-700 mt-8 md:mt-12" />
        </div>
      </section>
    </DefaultLayout>
  );
}