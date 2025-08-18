import * as React from "react";
import { useTranslation } from "react-i18next";
import { FaWhatsapp, FaStar, FaTimes } from "react-icons/fa";
import Loading from "@/components/loading";
import DefaultLayout from "@/layouts/default";
import { addToast } from "@heroui/toast";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

interface Product {
  ID: string;
  Name: string;
  Type: string;
  Size: string;
  "Qty Bought": number;
  "Final Selling Price": number;
  Status?: string;
  Notes?: string;
  Image?: string;
  Phone?: string;
  Logo?: string;
  Rating?: number;
  Images?: Record<string, string | null>;
}

const API_URL = import.meta.env.VITE_PRODUCT_DETAILS_API;

export default function Omellets() {
  const { t } = useTranslation();
  const [entries, setEntries] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [imageIndexes, setImageIndexes] = React.useState<Record<string, number>>({});

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = React.useState(false);
  const [selectedProductImages, setSelectedProductImages] = React.useState<string[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = React.useState(0);

  React.useEffect(() => {
    fetch(`${API_URL}?nocache=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.products)) {
          const mapped = data.products.map((p: any) => ({
            ID: p.ID || "N/A",
            Name: p.Name || "N/A",
            Type: p.Type || "-",
            Size: p.Size || "-",
            "Qty Bought": Number(p["Qty Bought"]) || 0,
            "Final Selling Price": Number(p["Final Selling Price"]) || 0,
            Status: p.Status || "",
            Notes: p.Notes || "",
            Image: p.Image || "",
            Phone: p.Phone || "",
            Logo: p.logo || "",
            Images: p.Images || {},
            Rating: Math.min(5, Math.max(0, Number(p.Rating) || 4)),
          }));
          setEntries(mapped);
          addToast({
            title: t("loaded_successfully"),
            description: t("products_have_been_loaded"),
            color: "success",
          });
        } else {
          addToast({
            title: t("error"),
            description: t("invalid_data"),
            color: "danger",
          });
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        addToast({
          title: t("error"),
          description: t("error_fetching"),
          color: "danger",
        });
      });
  }, [t]);

  function getAllImages(product: Product): string[] {
    const images: string[] = [];
    const keys = [
      "image_meain", "image_1", "image_2", "image_3", "image_4", "image_5",
      "image_6", "image_7", "image_8", "image_9", "image_10", "image_11",
      "image_12", "image_13", "image_14", "image_15",
    ] as const;

    if (product.Images) {
      keys.forEach((key) => {
        const url = product.Images?.[key];
        if (url && url.trim() !== "") images.push(url.trim());
      });
    }

    if (images.length === 0) {
      if (product.Image && product.Image.trim() !== "") images.push(product.Image.trim());
      else if (product.Logo && product.Logo.trim() !== "") images.push(product.Logo.trim());
      else images.push("/image/fly.png");
    }

    return images;
  }

  function handleNextImage(productId: string, totalImages: number) {
    setImageIndexes((prev) => {
      const current = prev[productId] ?? 0;
      const next = (current + 1) % totalImages;
      return { ...prev, [productId]: next };
    });
  }

  function handlePrevImage(productId: string, totalImages: number) {
    setImageIndexes((prev) => {
      const current = prev[productId] ?? 0;
      const prevIndex = (current - 1 + totalImages) % totalImages;
      return { ...prev, [productId]: prevIndex };
    });
  }

  const filteredEntries = entries.filter((entry) =>
    Object.values(entry).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <DefaultLayout>
      {loading ? (
        <Loading />
      ) : (
        <section className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="bg-gradient-to-r from-gray-300 to-[#0d7a68] text-white py-12 px-4 text-center shadow-md">
            <h1 className="text-5xl font-extrabold tracking-wide drop-shadow-md">
              <p >Omellet<span className="text-[#E43636]">'</span>s</p>
            </h1>
     <p className="mt-2 text-[16px] sm:text-[18px] md:text-[22px] lg:text-[28px] opacity-95 text-[#013e34]">
  
  {t("premium_airplane_models") || "Premium Model Aircraft • Collectors & Enthusiasts"}
</p>

          </div>

          <div className="max-w-7xl mx-auto py-10 px-4 space-y-8">
            <div className="flex justify-center">
              <input
                className="w-full max-w-lg px-5 py-3 rounded-full border border-[#0d7a68] focus:outline-none focus:ring-2 focus:ring-green-800 dark:bg-gray-800 dark:border-white dark:text-white shadow-sm"
                placeholder={t("search") || "Search airplane models..."}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {filteredEntries.length === 0 ? (
              <p className="text-center text-red-500 font-medium">
                {t("no_results_found") || "No results found"}
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEntries.map((entry) => {
                  const images = getAllImages(entry);
                  const currentImageIndex = imageIndexes[entry.ID] ?? 0;

                  return (
                    <div
                      key={entry.ID}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-shadow"
                    >
                      {/* Image section */}
                      <div
                        className="relative h-[250px] flex items-center justify-center rounded-lg overflow-hidden cursor-zoom-in"
                        onClick={() => {
                          setSelectedProductImages(images);
                          setSelectedImageIndex(currentImageIndex);
                          setLightboxOpen(true);
                        }}
                      >
                        {/* Blurred Background */}
                        <div
                          className="absolute inset-0 bg-cover bg-center filter blur-xl scale-110"
                          style={{
                            backgroundImage: `url(${images[currentImageIndex]})`,
                          }}
                        ></div>

                        {/* Overlay to dim background slightly */}
                        <div className="absolute inset-0 bg-black bg-opacity-10 dark:bg-opacity-20"></div>

                        {/* Foreground Image */}
                        <img
                          src={images[currentImageIndex]}
                          alt={`${entry.Name} image ${currentImageIndex + 1}`}
                          className="relative max-h-full max-w-full object-contain z-10"
                          loading="lazy"
                        />

                        {images.length > 1 && (
                          <>
                            {/* Left button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handlePrevImage(entry.ID, images.length);
                              }}
                              className="absolute top-1/2 left-4 -translate-y-1/2 text-2xl text-white hover:text-gray-200 z-20 transition"
                              aria-label={`Previous image of ${entry.Name}`}
                            >
                              <AiOutlineLeft />
                            </button>

                            {/* Right button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNextImage(entry.ID, images.length);
                              }}
                              className="absolute top-1/2 right-4 -translate-y-1/2 text-2xl text-white hover:text-gray-200 z-20 transition"
                              aria-label={`Next image of ${entry.Name}`}
                            >
                              <AiOutlineRight />
                            </button>
                          </>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex flex-col flex-1 p-5">
                        {/* Name + Price */}
                        <div className="flex justify-between items-center">
                          <h3 className="text-xl font-bold text-[#0d7a68] dark:text-white">
                            {entry.Name}
                          </h3>
                          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            {entry["Final Selling Price"].toLocaleString()} ₭
                          </span>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center mt-2">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={
                                i < (entry.Rating || 0)
                                  ? "text-yellow-400"
                                  : "text-gray-300 dark:text-gray-600"
                              }
                              size={14}
                            />
                          ))}
                          <span className="ml-1 text-xs text-gray-500">
                            ({entry.Rating || 0}/5)
                          </span>
                        </div>

                        {/* Details */}
                        <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
                          {t("id")}:{" "}
                          <span className="text-[#0d7a68] dark:text-white font-bold">
                            OMS-00-00-{entry.ID}
                          </span>
                        </p>

                        <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
                          {t("type")}:{" "}
                          <span className="text-[#0d7a68] dark:text-white font-bold">
                            {entry.Type}
                          </span>
                        </p>

                        <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
                          {t("size")}:{" "}
                          <span className="text-[#0d7a68] dark:text-white font-bold">
                            {entry.Size}
                          </span>
                        </p>

                        <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
                          {t("quantity")}:{" "}
                          <span className="text-[#0d7a68] dark:text-white font-bold">
                            {entry["Qty Bought"]}
                          </span>
                        </p>

                        {/* WhatsApp Button */}
                        <a
                          className="mt-4 inline-flex items-center justify-center gap-2 bg-[#0d7a68] text-white font-medium py-2 px-5 rounded-full hover:bg-[#0d7a68] hover:transition-all shadow-md"
                          href={`https://wa.me/2055058028?text=${encodeURIComponent(
                            `New Order Request\n` +
                            `ID: OMS-00-00-${entry.ID}\n` +
                            `Name: ${entry.Name}\n` +
                            `Type: ${entry.Type}\n` +
                            `Size: ${entry.Size}\n` +
                            `Price: ${entry["Final Selling Price"].toLocaleString()} ₭\n` +
                            `Please confirm availability.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaWhatsapp size={20} />
                          <span className="hidden sm:inline hover:decoration-white hover:underline">
                            {t("shop_now") || "Order Now"}
                          </span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-8 w-80 mx-auto">
              <div className="h-1 w-full bg-[#0d7a68]" />
            </div>
          </div>
        </section>
      )}

      {/* Simplified Lightbox Modal with one-tap closing */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          {/* Image container with navigation arrows */}
          <div className="relative max-w-full max-h-full">
            {/* Navigation Arrows - only show if multiple images */}
            {selectedProductImages.length > 1 && (
              <>
                <button
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-4xl z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex(
                      (prev) => (prev - 1 + selectedProductImages.length) % selectedProductImages.length
                    );
                  }}
                  aria-label="Previous image"
                >
                  <AiOutlineLeft />
                </button>
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex((prev) => (prev + 1) % selectedProductImages.length);
                  }}
                  aria-label="Next image"
                >
                  <AiOutlineRight />
                </button>
              </>
            )}

            {/* Main Image */}
            <img
              src={selectedProductImages[selectedImageIndex]}
              alt={`Fullscreen view ${selectedImageIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain cursor-pointer"
            />


          </div>
          {/* Image Counter */}
          {selectedProductImages.length > 1 && (
            <div className="absolute bottom-8 left-0 right-0 text-center text-white text-sm">
              {selectedImageIndex + 1} / {selectedProductImages.length}
            </div>
          )}
        </div>
      )}
    </DefaultLayout>
  );
}