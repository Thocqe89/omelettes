import * as React from "react";
import { useTranslation } from "react-i18next";
import { FaWhatsapp, FaShoppingCart, FaStar } from "react-icons/fa";
import { AiOutlineLeft, AiOutlineRight, AiOutlineHeart } from "react-icons/ai";
import Loading from "@/components/loading";
import DefaultLayout from "@/layouts/default";
import { addToast } from "@heroui/toast";
import { Image } from "@heroui/image";

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
  Colors?: string[];
  Material?: string;
  Rating?: number;
}

const API_URL = import.meta.env.VITE_PRODUCT_DETAILS_API;

export default function ClothingStore() {
  const { t } = useTranslation();
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [imageIndexes, setImageIndexes] = React.useState<Record<string, number>>({});
  const [openDetails, setOpenDetails] = React.useState<Record<string, boolean>>({});
  const [favorites, setFavorites] = React.useState<Record<string, boolean>>({});
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");

  React.useEffect(() => {
    fetch(`${API_URL}?nocache=${Date.now()}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.products)) {
          const processedProducts = data.products.map((p: any) => ({
            ID: p.ID || "N/A",
            Name: p.Name || "N/A",
            Type: p.Type || "-",
            Size: p.Size || "-",
            "Qty Bought": Number(p["Qty Bought"]) || 0,
            "Final Selling Price": Number(p["Final Selling Price"]) || 0,
            Status: p.Status || "available",
            Notes: p.Notes || "",
            Image: p.Image || "",
            Phone: p.Phone || "",
            Logo: p.logo || "",
            Images: p.Images || {},
            Colors: p.Colors ? p.Colors.split(",").map((c: string) => c.trim()) : [],
            Material: p.Material || "Cotton blend",
            Rating: Math.min(5, Math.max(0, Number(p.Rating) || 4)),
          }));
          
          setProducts(processedProducts);
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
    // First try to get all images from the Images object
    if (product.Images) {
      const imageUrls = Object.values(product.Images)
        .filter(url => url && typeof url === 'string' && url.trim() !== '')
        .map(url => (url as string).trim());
      
      if (imageUrls.length > 0) {
        return imageUrls;
      }
    }

    // Then try the main Image field
    if (product.Image && product.Image.trim() !== '') {
      return [product.Image.trim()];
    }

    // Then try the Logo field
    if (product.Logo && product.Logo.trim() !== '') {
      return [product.Logo.trim()];
    }

    // Fallback to placeholder
    return ["/placeholder-product.jpg"];
  }

  function getBestImage(product: Product): string {
    const images = getAllImages(product);
    return images[0];
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

  function toggleFavorite(id: string) {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  const categories = React.useMemo(() => {
    const allCategories = new Set(products.map(p => p.Type.toLowerCase()));
    return ["all", ...Array.from(allCategories)];
  }, [products]);

  const filteredProducts = products.filter((product) => {
    // Filter by search term
    const matchesSearch = Object.values(product).some((v) =>
      String(v).toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    // Filter by category
    const matchesCategory = selectedCategory === "all" || 
      product.Type.toLowerCase() === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <DefaultLayout>
      {loading ? (
        <Loading />
      ) : (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          {/* Hero Banner */}
          <div className="relative w-full h-64 md:h-96 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">Fashion Collection</h1>
              <p className="text-xl md:text-2xl">Premium Socks & Clothing</p>
            </div>
          </div>

          <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            {/* Search and Filter Section */}
            <div className="mb-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
                <div className="w-full md:w-1/2">
                  <input
                    className="w-full px-5 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white shadow-sm"
                    placeholder={t("search") || "Search products..."}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    aria-label={t("search") || "Search products"}
                  />
                </div>
               <div className="w-full overflow-x-auto pb-2">
  <div className="flex space-x-2 min-w-max">
    {categories.map(category => (
      <button
        key={category}
        onClick={() => setSelectedCategory(category)}
        className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 ${
          selectedCategory === category
            ? 'bg-black text-white shadow-md'
            : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
        }`}
      >
        {category}
      </button>
    ))}
  </div>
</div>
              </div>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600 dark:text-gray-400">
                  {t("no_results_found") || "No products found matching your criteria"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => {
                  const images = getAllImages(product);
                  const idx = imageIndexes[product.ID] ?? 0;
                  const isOpen = openDetails[product.ID] || false;
                  const isFavorite = favorites[product.ID] || false;
                  const mainImage = getBestImage(product);

                  return (
                    <div
                      key={product.ID}
                      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
                    >
                      {/* Image Section */}
                      <div className="relative h-64 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                        {/* Favorite Button */}
                        <button
                          onClick={() => toggleFavorite(product.ID)}
                          className="absolute top-3 right-3 z-10 p-2 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                        >
                          <AiOutlineHeart 
                            size={20} 
                            className={isFavorite ? "text-red-500 fill-current" : "text-gray-500"} 
                          />
                        </button>
                        
                        {/* Product Image - with fallback handling */}
                        {images.length > 0 ? (
                          <>
                            <img
                              src={images[idx]}
                              alt={`${product.Name} image ${idx + 1}`}
                              className="object-contain max-h-full max-w-full"
                              loading="lazy"
                              onError={(e) => {
                                // If image fails to load, try the logo
                                if (product.Logo) {
                                  (e.target as HTMLImageElement).src = product.Logo;
                                } else {
                                  // Final fallback to placeholder
                                  (e.target as HTMLImageElement).src = "/placeholder-product.jpg";
                                }
                              }}
                            />
                            
                            {/* Image Navigation */}
                            {images.length > 1 && (
                              <>
                                <button
                                  onClick={() => handlePrevImage(product.ID, images.length)}
                                  className="absolute top-1/2 left-3 -translate-y-1/2 bg-black bg-opacity-30 text-white p-2 rounded-full hover:bg-opacity-50 transition"
                                  aria-label={`Previous image of ${product.Name}`}
                                >
                                  <AiOutlineLeft size={18} />
                                </button>
                                <button
                                  onClick={() => handleNextImage(product.ID, images.length)}
                                  className="absolute top-1/2 right-3 -translate-y-1/2 bg-black bg-opacity-30 text-white p-2 rounded-full hover:bg-opacity-50 transition"
                                  aria-label={`Next image of ${product.Name}`}
                                >
                                  <AiOutlineRight size={18} />
                                </button>
                              </>
                            )}
                          </>
                        ) : (
                          <div className="flex items-center justify-center h-full w-full bg-gray-200 dark:bg-gray-600">
                            <span className="text-gray-500 dark:text-gray-400">No image available</span>
                          </div>
                        )}
                        
                        {/* Status Badge */}
                        {product.Status && product.Status.toLowerCase() !== "available" && (
                          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                            {product.Status}
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="p-4 flex flex-col flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {product.Name}
                          </h3>
                          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                            {product["Final Selling Price"].toLocaleString()} ₭
                          </p>
                        </div>
                        
                        {/* Rating */}
                        <div className="flex items-center mb-3">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={`${i < (product.Rating || 0) 
                                ? 'text-yellow-400' 
                                : 'text-gray-300 dark:text-gray-600'}`}
                              size={14}
                            />
                          ))}
                          <span className="text-xs text-gray-500 ml-1">
                            ({product.Rating || 0}/5)
                          </span>
                        </div>
                        
                        {/* Quick Info */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          {product.Type && (
                            <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                              {product.Type}
                            </span>
                          )}
                          {product.Size && (
                            <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded">
                              Size: {product.Size}
                            </span>
                          )}
                          {product.Colors && product.Colors.length > 0 && (
                            <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">
                              {product.Colors.length} colors
                            </span>
                          )}
                        </div>

                        {/* Toggle Details Button */}
                        <button
                          onClick={() =>
                            setOpenDetails((prev) => ({
                              ...prev,
                              [product.ID]: !isOpen,
                            }))
                          }
                          className="mt-auto text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition"
                          aria-expanded={isOpen}
                          aria-controls={`details-${product.ID}`}
                        >
                          {isOpen ? "Hide details" : "Show details"}
                        </button>

                        {/* Expanded Details */}
                        {isOpen && (
                          <div
                            id={`details-${product.ID}`}
                            className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 space-y-2 text-sm"
                          >
                            {product.Material && (
                              <p>
                                <span className="font-medium">Material:</span> {product.Material}
                              </p>
                            )}
                            {product.Notes && (
                              <p>
                                <span className="font-medium">Notes:</span> {product.Notes}
                              </p>
                            )}
                            <p>
                              <span className="font-medium">In stock:</span> {product["Qty Bought"]}
                            </p>
                            
                            {/* Action Buttons */}
                            <div className="flex gap-2 mt-4">
                               <a
  className="mt-4 inline-flex items-center justify-center gap-2 bg-green-700 text-white font-medium py-2 px-5 rounded-full hover:bg-green-800 transition-all shadow-md"
  href={`https://wa.me/${product.Phone?.replace(/\D/g, "") || "2055058028"}?text=${encodeURIComponent(
    `I'm interested in purchasing:\n\n` +
    `*Product Name:* ${product.Name}\n` +
    `*Type:* ${product.Type}\n` +
    `*Size:* ${product.Size}\n` +
    `*Price:* ${product["Final Selling Price"].toLocaleString()} ₭\n\n` +
    `Please let me know about availability and payment options.`
  )}`}
  target="_blank"
  rel="noopener noreferrer"
  aria-label={`${t("order_now") || "Order Now"} - ${product.Name}`}
>
  <FaWhatsapp size={20} />
  {t("order_now") || "Order Now"}
</a>
                             
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </DefaultLayout>
  );
}