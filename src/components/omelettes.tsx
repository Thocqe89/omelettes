import * as React from "react";
import { useTranslation } from "react-i18next";
import { FaWhatsapp, FaStar, FaTruck, FaExternalLinkAlt } from "react-icons/fa";
import Loading from "@/components/loading";
import DefaultLayout from "@/layouts/default";
import { addToast } from "@heroui/toast";
import { FiShoppingCart } from "react-icons/fi";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import { motion } from "framer-motion";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Textarea,
  Checkbox,
  Link
} from "@heroui/react";

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

interface OrderDetails {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  customerName: string;
  phone: string;
  address: string;
  notes: string;
  includeLogistics: boolean;
}

const API_URL = import.meta.env.VITE_PRODUCT_DETAILS_API;

const AnimatedPrice = ({ price }: { price: number }) => {
  const [displayPrice, setDisplayPrice] = React.useState(0);

  React.useEffect(() => {
    const duration = 1500;
    const frameDuration = 1000 / 60;
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const currentPrice = Math.round(price * progress);
      setDisplayPrice(currentPrice);

      if (frame === totalFrames) {
        clearInterval(counter);
        setDisplayPrice(price);
      }
    }, frameDuration);

    return () => clearInterval(counter);
  }, [price]);

  return (
    <motion.span
      className="text-lg font-bold text-red-600 dark:text-red-400"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {displayPrice.toLocaleString()} ₭
    </motion.span>
  );
};

export default function Omellets() {
  const { t } = useTranslation();
  const [entries, setEntries] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [imageIndexes, setImageIndexes] = React.useState<Record<string, number>>({});
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
  const [orderDetails, setOrderDetails] = React.useState<OrderDetails>({
    productId: "",
    productName: "",
    price: 0,
    quantity: 1,
    customerName: "",
    phone: "",
    address: "",
    notes: "",
    includeLogistics: false
  });

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
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [t]);

  const openOrderModal = (product: Product) => {
    setSelectedProduct(product);
    setOrderDetails({
      productId: product.ID,
      productName: product.Name,
      price: product["Final Selling Price"],
      quantity: 1,
      customerName: "",
      phone: "",
      address: "",
      notes: "",
      includeLogistics: false
    });
    onOpen();
  };

  const handleOrderSubmit = () => {
    // Get current date and time
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const formattedTime = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
    
    const message = `🛒 New Order Request | ${formattedDate} at ${formattedTime}\n
Product Details | 
ID: OMS-00-00-${orderDetails.productId}
Name: ${orderDetails.productName}
Type: ${selectedProduct?.Type}
Size: ${selectedProduct?.Size}
Price: ${orderDetails.price.toLocaleString()} ₭
Quantity: ${orderDetails.quantity}
{*Logistics services provided free of charge }
___________________________________________
${orderDetails.includeLogistics ? 'I will  pickup.(T2 bannakham, sekhodthabong distick Vietaine proviece lao) ':'Please include logistics/delivery service.' }`;


    // Fixed WhatsApp URL with proper country code
    const whatsappUrl = `https://wa.me/8562055058028?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    onOpenChange();
  };

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
              <p>Omellet<span className="text-[#E43636]">'</span>s</p>
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
                    <motion.div
                      key={entry.ID}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-shadow"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
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
                          <AnimatedPrice price={entry["Final Selling Price"]} />
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

                        {/* Order Now Button */}
                        <button
                          onClick={() => openOrderModal(entry)}
                          className="mt-4 inline-flex items-center justify-center gap-2 bg-[#0d7a68] text-white font-medium py-2 px-5 rounded-full hover:bg-[#0b6a5a] transition-all shadow-md"
                        >
                          <FaWhatsapp size={20} />
                          <span className="hidden sm:inline">
                            {t("shop_now") || "Order Now"}
                          </span>
                        </button>
                      </div>
                    </motion.div>
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

      {/* Order Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                 <FiShoppingCart className="text-green-900" />
                 {t("shop_now")} : {selectedProduct?.Name}
                </div>
              </ModalHeader>
              <ModalBody className="space-y-4">
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                  <h4 className=" font-semibold mb-2">Order Summary</h4>
                  <p>{t("id")}: OMS-00-00-{selectedProduct?.ID}</p>
                  <p>{t("name")}: {selectedProduct?.Name}</p>
                  <p>{t("size")}: {selectedProduct?.Size}</p>
                  <p>{t("type")}: {selectedProduct?.Type}</p>
                  <p>{t("price")}: {selectedProduct?.["Final Selling Price"].toLocaleString()} ₭</p>
                  
                   <p className="text-[#e80501] ">*Logistics services provided free of charge</p>
                  {orderDetails.includeLogistics && (
                    <p className="text-[#0d7a68] ">+ Delivery Address: {orderDetails.address}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Checkbox
                    isSelected={orderDetails.includeLogistics}
                    onValueChange={(checked) => setOrderDetails({ ...orderDetails, includeLogistics: checked })}
                  />
                  <span className="text-sm">Include logistics/delivery service</span>
                  <FaTruck className="text-[#0d7a68]  ml-2" />
                </div>

                {/* {orderDetails.includeLogistics && (
                   <Textarea
                    label="Delivery Address"
                    placeholder="Enter your complete address for delivery"
                    value={orderDetails.address}
                    onChange={(e) => setOrderDetails({...orderDetails, address: e.target.value})}
                    minRows={3}
                  />
                )}

                <Textarea
                  label="Additional Notes (Optional)"
                  placeholder="Any special requests or notes..."
                  value={orderDetails.notes}
                  onChange={(e) => setOrderDetails({...orderDetails, notes: e.target.value})}
                  minRows={2}
                /> */}

                {/* Logistics Page Link */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-700">
                  <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                    <FaTruck className="flex-shrink-0" />
                    <span>Need to arrange logistics separately?</span>
                  </div>
                  <Link
                    href="#"
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm mt-1 inline-flex items-center gap-1"
                    showAnchorIcon
                    anchorIcon={<FaExternalLinkAlt size={12} />}
                  >
                    Visit our logistics page
                  </Link>
                </div>


              </ModalBody>
              <ModalFooter>
                <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800">
                  Cancel
                </button>
                <button
                  onClick={handleOrderSubmit}
                  className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2"
                >
                  <FaWhatsapp />
                  Send via WhatsApp
                </button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}>
          <div className="relative max-w-full max-h-full">
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
                >
                  <AiOutlineLeft />
                </button>
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-4xl z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex((prev) => (prev + 1) % selectedProductImages.length);
                  }}
                >
                  <AiOutlineRight />
                </button>
              </>
            )}
            <img
              src={selectedProductImages[selectedImageIndex]}
              alt={`Fullscreen view ${selectedImageIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain cursor-pointer"
            />
            {selectedProductImages.length > 1 && (
              <div className="absolute bottom-8 left-0 right-0 text-center text-white text-sm">
                {selectedImageIndex + 1} / {selectedProductImages.length}
              </div>
            )}
          </div>
        </div>
      )}
    </DefaultLayout>
  );
}