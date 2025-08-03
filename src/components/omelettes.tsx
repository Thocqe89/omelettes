import * as React from "react";
import { useTranslation } from "react-i18next";
import { FaWhatsapp, FaPlane } from "react-icons/fa";
import Loading from "@/components/loading";
import DefaultLayout from "@/layouts/default";
import { addToast } from "@heroui/toast";
import "aos/dist/aos.css";
import { Image } from "@heroui/image";
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
  Images?: {
    image_meain?: string | null;
    image_1?: string | null;
    image_2?: string | null;
    image_3?: string | null;
    image_4?: string | null;
    image_5?: string | null;
    image_6?: string | null;
    image_7?: string | null;
      image_8?: string | null;
    image_9?: string | null;
    image_10?: string | null;
    image_11?: string | null;
    image_12?: string | null;
    image_13?: string | null;
    image_14?: string | null;
    image_15?: string | null;
  };
}

const API_URL = import.meta.env.VITE_PRODUCT_DETAILS_API;

export default function Omellets() {
  const { t } = useTranslation();
  const [entries, setEntries] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");

  // Track current image index per product by ID
  const [imageIndexes, setImageIndexes] = React.useState<Record<string, number>>({});

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

  // Helper: Get all valid images from Images object or fallbacks
  function getAllImages(product: Product): string[] {
    const images: string[] = [];
    const keys = [
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
      
    ] as const;

    if (product.Images) {
      keys.forEach((key) => {
        const url = product.Images?.[key];
        if (url && url.trim() !== "") {
          images.push(url.trim());
        }
      });
    }

    // Fallback images if none found
    if (images.length === 0) {
      if (product.Image && product.Image.trim() !== "") images.push(product.Image.trim());
      else if (product.Logo && product.Logo.trim() !== "") images.push(product.Logo.trim());
      else images.push("/image/fly.png");
    }

    return images;
  }

  // Handler: Next image index for a product
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
          {/* Hero */}
          <div className="bg-gradient-to-r from-gray-300 to-[#0d7a68] text-white py-12 px-4 text-center shadow-md">
            <h1 className="text-5xl font-extrabold tracking-wide drop-shadow-md">
              {t("omellets") || "Omellet’s Airplane Models"}
            </h1>
            <p className="mt-3 text-lg opacity-95">
              {t("premium_model_aircraft") ||
                "Premium Model Aircraft • Collectors & Enthusiasts"}
            </p>
          </div>

          <div className="max-w-7xl mx-auto py-10 px-4 space-y-8">
            {/* Search */}
            <div className="flex justify-center">
              <input
                className="w-full max-w-lg px-5 py-3 rounded-full border border-[#0d7a68] focus:outline-none focus:ring-2 focus:ring-green-800 dark:bg-gray-800 dark:border-[#0d7a68] dark:text-white shadow-sm"
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
                      data-aos="fade-up"
                    >
                      {/* Image with Next button */}
                     
<div className="relative h-[300px] bg-gray-100 dark:bg-gray-700 p-4 flex items-center justify-center">
  <img
    src={images[currentImageIndex]}
    alt={`${entry.Name} image ${currentImageIndex + 1}`}
    className="object-contain max-h-full max-w-full rounded-lg shadow-md"
    loading="lazy"
  />

  {images.length > 1 && (
    <>
      {/* Left button */}
      <button
        onClick={() => handlePrevImage(entry.ID, images.length)}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 text-2xl text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition"
        aria-label={`Previous image of ${entry.Name}`}
      >
        <AiOutlineLeft />
      </button>

      {/* Right button */}
      <button
        onClick={() => handleNextImage(entry.ID, images.length)}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 text-2xl text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 transition"
        aria-label={`Next image of ${entry.Name}`}
      >
        <AiOutlineRight />
      </button>
    </>
  )}
</div>

                      {/* Content */}
                      <div className="flex flex-col flex-1 p-5">
                        {/* Name & Logo */}
                        <h3 className="text-xl font-bold text-[#0d7a68] dark:text-[#0d7a68] flex items-center gap-3">
                          {entry.Logo ? (
                            <Image
                              isBlurred
                              src={entry.Logo}
                              alt={`${entry.Name} logo`}
                              className="w-16 h-16 object-contain bg-transparent"
                            />
                          ) : (
                            <FaPlane className="text-sky-500" />
                          )}
                           <span className="text-gray-400 text-2xl font-light">|</span>
                          {entry.Name}
                        </h3>

                        {/* Details */}
<p className="text-sm mt-1 text-gray-700 dark:text-gray-300">
  {t("id")}: <span className="text-[#0d7a68] dark:text-[#0d7a68]">
    OMS-00-00-{entry.ID}
  </span>
</p>

<p className="text-sm">
  {t("type")}: <span className="text-[#0d7a68] dark:text-[#0d7a68]">
    {entry.Type}
  </span>
</p>

<p className="text-sm">
  {t("size")}: <span className="text-[#0d7a68] dark:text-[#0d7a68]">
    {entry.Size}
  </span>
</p>

<p className="text-sm mt-1 text-gray-700 dark:text-gray-300">
  {t("quantity")}: <span className="text-[#0d7a68] dark:text-[#0d7a68]">
    {entry["Qty Bought"]}
  </span>
</p>

{/* Price */}
<p className="text-sm mt-2">
  <span className="text-gray-500 dark:text-gray-400">{t("price")}:</span>{" "}
  <span className="text-[#0d7a68] dark:text-[#0d7a68] font-semibold">
    {entry["Final Selling Price"].toLocaleString(undefined, {
      style: "currency",
      currency: "LAK",
    })}
  </span>
</p>


                        {/* WhatsApp Button */}
                        <a
                          className="mt-4 inline-flex items-center justify-center gap-2 bg-[#0d7a68] text-white font-medium py-2 px-5 rounded-full hover:bg-[#0d7a68] transition-all shadow-md"
                          href={`https://wa.me/2055058028`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaWhatsapp size={20} />
                          <span className="hidden sm:inline">
                            {t("shop_now") || "Order Now"}
                          </span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-8 w-80 mx-auto" data-aos="zoom-in">
              <div className="h-1 w-full bg-[#0d7a68]" />
            </div>
          </div>
        </section>
      )}
    </DefaultLayout>
  );
}
