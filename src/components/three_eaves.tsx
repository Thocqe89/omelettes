import * as React from "react";
import { useTranslation } from "react-i18next";
import { FaWhatsapp, FaLeaf } from "react-icons/fa";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import Loading from "@/components/loading";
import DefaultLayout from "@/layouts/default";
import { addToast } from "@heroui/toast";
import { Image } from "@heroui/image";
import "aos/dist/aos.css";

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
  Images?: { [key: string]: string | null };
}

const API_URL = import.meta.env.VITE_PRODUCT_DETAILS_API;

export default function ThreeLeaves() {
  const { t } = useTranslation();
  const [entries, setEntries] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [imageIndexes, setImageIndexes] = React.useState<Record<string, number>>({});
  const [openDetails, setOpenDetails] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    fetch(`${API_URL}?nocache=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.products)) {
          setEntries(
            data.products.map((p: any) => ({
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
              Logo: p.Logo || "",
              Images: p.Images || {},
            }))
          );
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
    const keys = [
      "image_meain",
      ...Array.from({ length: 15 }, (_, i) => `image_${i + 1}`),
    ] as const;
    const images: string[] = [];

    if (product.Images) {
      keys.forEach((key) => {
        const url = product.Images?.[key];
        if (url && url.trim()) images.push(url.trim());
      });
    }
    if (images.length === 0) {
      if (product.Image?.trim()) images.push(product.Image.trim());
      else if (product.Logo?.trim()) images.push(product.Logo.trim());
      else images.push("/image/three_leaves_df.png");
    }
    return images;
  }

  function handleNextImage(id: string, total: number) {
    setImageIndexes((prev) => ({ ...prev, [id]: ((prev[id] ?? 0) + 1) % total }));
  }

  function handlePrevImage(id: string, total: number) {
    setImageIndexes((prev) => ({
      ...prev,
      [id]: (prev[id] ?? 0) - 1 < 0 ? total - 1 : (prev[id] ?? 0) - 1,
    }));
  }

  const filteredEntries = entries.filter((e) =>
    Object.values(e).some((v) =>
      String(v).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <DefaultLayout>
      {loading ? (
        <Loading />
      ) : (
        <section className="min-h-screen bg-gradient-to-b from-green-100 to-green-300 dark:bg-gray-900">
          {/* Hero */}
          <div className="bg-gradient-to-r from-green-600 to-green-900 border-b border-green-700 text-white py-12 px-4 text-center shadow-md">
            <div className="flex justify-center mb-4">
              <Image
                src="/image/menu/th3.png"
                alt="Three Leaves Logo"
                width={150}
                height={150}
                className="rounded-full border-4 border-green-800 shadow-lg p-2 bg-white/80"
              />
            </div>
            <h1 className="text-5xl text-white font-extrabold tracking-wide drop-shadow-lg">
              Three <span className="text-red-400">|</span> Leaves
            </h1>
          </div>

          <div className="max-w-7xl mx-auto py-10 px-4 space-y-8">
            {/* Search */}
            <div className="flex justify-center">
              <input
                className="w-full max-w-lg px-5 py-3 rounded-full border border-green-700 focus:outline-none focus:ring-2 focus:ring-green-900 dark:bg-gray-800 dark:border-green-700 dark:text-white shadow-sm"
                placeholder={t("search") || "Search products..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label={t("search") || "Search products"}
              />
            </div>

            {filteredEntries.length === 0 ? (
              <p className="text-center text-red-600 font-medium">
                {t("no_results_found") || "No results found"}
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEntries.map((entry) => {
                  const images = getAllImages(entry);
                  const idx = imageIndexes[entry.ID] ?? 0;
                  const isOpen = openDetails[entry.ID] || false;

                  return (
                    <div
                      key={entry.ID}
                      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-shadow"
                      data-aos="fade-up"
                    >
                      {/* Image Carousel */}
                      <div className="relative h-[300px] bg-green-50 dark:bg-gray-700 flex items-center justify-center rounded-t-2xl">
                        <img
                          src={images[idx]}
                          alt={`${entry.Name} image ${idx + 1}`}
                          className="object-contain max-h-full max-w-full rounded-t-2xl"
                          loading="lazy"
                        />
                        {images.length > 1 && (
                          <>
                            <button
                              onClick={() => handlePrevImage(entry.ID, images.length)}
                              className="absolute top-1/2 left-4 -translate-y-1/2 text-3xl text-green-700 hover:text-green-900 dark:text-green-300 dark:hover:text-white transition"
                              aria-label={`Previous image of ${entry.Name}`}
                            >
                              <AiOutlineLeft />
                            </button>
                            <button
                              onClick={() => handleNextImage(entry.ID, images.length)}
                              className="absolute top-1/2 right-4 -translate-y-1/2 text-3xl text-green-700 hover:text-green-900 dark:text-green-300 dark:hover:text-white transition"
                              aria-label={`Next image of ${entry.Name}`}
                            >
                              <AiOutlineRight />
                            </button>
                          </>
                        )}
                      </div>

                      {/* Name & Price */}
                      <div className="flex flex-col flex-1 p-5">
                        <h3 className="text-xl font-bold text-green-900 dark:text-green-400 flex items-center gap-2">
                          {entry.Logo ? (
                            <Image
                              src={entry.Logo}
                              alt={`${entry.Name} logo`}
                              className="w-12 h-12 object-contain"
                            />
                          ) : (
                            <FaLeaf className="text-green-600" />
                          )}
                          {entry.Name}
                        </h3>
                        <p className="text-green-700 dark:text-green-300 font-semibold mt-1">
                          {entry["Final Selling Price"].toLocaleString()} ₭
                        </p>

                        {/* Toggle Details */}
                        <button
                          onClick={() =>
                            setOpenDetails((prev) => ({
                              ...prev,
                              [entry.ID]: !isOpen,
                            }))
                          }
                          className="mt-3 text-sm text-green-700 dark:text-green-400 underline hover:text-green-900"
                          aria-expanded={isOpen}
                          aria-controls={`details-${entry.ID}`}
                        >
                          {isOpen ? t("hide_details") || "Hide Details" : t("show_details") || "Show Details"}
                        </button>

                        {/* Details Dropdown */}
                       {isOpen && (
  <div
    id={`details-${entry.ID}`}
    className="mt-3 space-y-2 text-sm text-gray-700 dark:text-gray-300 border-t border-green-300 dark:border-green-700 pt-4"
  >
    <p>
      <strong>{t("type") || "Type"}:</strong> {entry.Type}
    </p>
    <p>
      <strong>{t("size") || "Size"}:</strong> {entry.Size}
    </p>
    <p>
      <strong>{t("quantity") || "Quantity"}:</strong> {entry["Qty Bought"]}
    </p>
    {entry.Notes && (
      <p>
        <strong>{t("notes") || "Notes"}:</strong> {entry.Notes}
      </p>
    )}

    {/* WhatsApp button inside details */}
    <a
      className="mt-4 inline-flex items-center justify-center gap-2 bg-green-700 text-white font-medium py-2 px-5 rounded-full hover:bg-green-800 transition-all shadow-md"
      href={`https://wa.me/${entry.Phone?.replace(/\D/g, "") || "2055058028"}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${t("order_now") || "Order Now"} - ${entry.Name}`}
    >
      <FaWhatsapp size={20} />
      {t("order_now") || "Order Now"}
    </a>
  </div>
)}


                        {/* WhatsApp */}
                      
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}
    </DefaultLayout>
  );
}
