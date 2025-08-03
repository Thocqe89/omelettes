import * as React from "react";
import { useTranslation } from "react-i18next";
// import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/modal";
import { useState } from "react";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { AiFillTruck } from "react-icons/ai";
import {
  AiOutlineRight,
  AiOutlinePlusCircle,
  AiOutlineMinusCircle,
} from "react-icons/ai";
import "aos/dist/aos.css";
import { Image } from "@heroui/image";

import DefaultLayout from "@/layouts/default";

export default function StorePage() {
  const { t } = useTranslation();
  // const [openModal, setOpenModal] = useState<string | null>(null);
  // const handleOpen = (modalName: string) => () => setOpenModal(modalName);
  // const handleClose = () => setOpenModal(null);

  // const imgbcel = "/image/10.png";
  // const imgjdb = "/image/8.png";
  // const imgldb = "/image/9.png";

  const [showNotice, setShowNotice] = React.useState(false);
  const handleClick = () => {
    setShowNotice(true);
  };

  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const toggleExpand = (productId: string) => {
    setExpandedProduct((prev) => (prev === productId ? null : productId));
  };

  // Omelette’s airplane model products
  const airplaneProducts = [
    {
      id: "comac_c919",
      nameKey: "product_comac_c919_name",
      descriptionKey: "product_comac_c919_description",
      priceKey: "price_comac",
      imageSrc: "c919/p1.png",
      orderId: "OMS202501",
      isNew: true,
    },
    {
      id: "qatar_777",
      nameKey: "product_qatar_777_name",
      descriptionKey: "product_qatar_777_description",
      priceKey: "price_qatar",
      imageSrc: "c919/p3.png",
      orderId: "OMS202502",
    },
    {
      id: "antonov_an225",
      nameKey: "product_antonov_an225_name",
      descriptionKey: "product_antonov_an225_description",
      priceKey: "price_antonov",
      imageSrc: "c919/p2.png",
      orderId: "OMS202503",
    },
    {
      id: "china_eastern_c919",
      nameKey: "product_china_eastern_c919_name",
      descriptionKey: "product_china_eastern_c919_description",
      priceKey: "price_china_eastern",
      imageSrc: "c919/p4.png",
      orderId: "OMS202504",
      isNew: true,
    },
  ];

  // three_leaves brand products
  const threeLeavesProducts = [
    {
      id: "three_leaves_tee",
      nameKey: "product_three_leaves_tee_name",
      descriptionKey: "product_three_leaves_tee_description",
      priceKey: "price_three_leaves_tee",
      imageSrc: "three_leaves/tee.png",
      orderId: "TLS202501",
      isNew: false,
    },
    {
      id: "three_leaves_hoodie",
      nameKey: "product_three_leaves_hoodie_name",
      descriptionKey: "product_three_leaves_hoodie_description",
      priceKey: "price_three_leaves_hoodie",
      imageSrc: "three_leaves/hoodie.png",
      orderId: "TLS202502",
      isNew: true,
    },
    {
      id: "three_leaves_cap",
      nameKey: "product_three_leaves_cap_name",
      descriptionKey: "product_three_leaves_cap_description",
      priceKey: "price_three_leaves_cap",
      imageSrc: "three_leaves/cap.png",
      orderId: "TLS202503",
      isNew: false,
    },
  ];

  // Helper to render product cards
  const renderProducts = (
    products: typeof airplaneProducts | typeof threeLeavesProducts,
  ) =>
    products.map((product) => (
      <div
        key={product.id}
        className="group flex flex-col justify-between
                   h-[580px] md:h-[650px]
                   bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-md
                   hover:shadow-lg hover:scale-[1.02] transition-all duration-300 relative overflow-hidden
                   border-2 border-[#0d7a68] dark:border-green-600"
        data-aos="fade-up"
      >
        {product.isNew && (
          <span className="absolute top-0 right-0 mt-6 mr-6 bg-green-500 text-white text-xs sm:text-sm font-bold px-3 py-1 rounded-full z-10 animate-pulse">
            {t("new_arrival")}
          </span>
        )}

        <div className="flex justify-center items-center h-2/5 md:h-1/2 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-700 mb-4">
          <Image
            isZoomed
            alt={t(product.nameKey)}
            className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-500"
            src={product.imageSrc}
          />
        </div>

        <div className="flex flex-col items-center text-center flex-grow">
          <h2 className="text-xl sm:text-2xl text-gray-800 dark:text-gray-100 font-semibold mb-2 break-words leading-tight">
            {t(product.nameKey)}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-500 dark:text-gray-400 mb-4 font-medium">
            {t("price")}
          </p>
          <p className="text-3xl sm:text-4xl text-green-700 dark:text-green-400 font-extrabold mb-4">
            {t(product.priceKey)}
          </p>

          <button
            className="flex items-center justify-center mx-auto mb-4 text-sm sm:text-base text-green-600 dark:text-green-300 hover:text-green-800 dark:hover:text-green-100 hover:underline transition-colors duration-200 font-medium"
            onClick={() => toggleExpand(product.id)}
          >
            {expandedProduct === product.id ? (
              <>
                <AiOutlineMinusCircle className="mr-2" size={20} />
                {t("show_less")}
              </>
            ) : (
              <>
                <AiOutlinePlusCircle className="mr-2" size={20} />
                {t("show_details")}
              </>
            )}
          </button>

          {expandedProduct === product.id ? (
            <div className="mt-4 animate-fade-in-down flex-grow overflow-y-auto pr-2 custom-scrollbar text-gray-700 dark:text-gray-200 text-sm md:text-base">
              <p className="mb-4 text-justify leading-relaxed">
                {t(product.descriptionKey)}
              </p>
              <ul className="space-y-2 mb-4 text-left px-2 md:px-4">
                <li className="flex items-center">
                  <span className="text-green-500 dark:text-green-400 mr-2">
                    ✔
                  </span>{" "}
                  {t("feature_high_quality")}
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 dark:text-green-400 mr-2">
                    ✔
                  </span>{" "}
                  {t("feature_detailed_design")}
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 dark:text-green-400 mr-2">
                    ✔
                  </span>{" "}
                  {t("feature_perfect_display")}
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 dark:text-green-400 mr-2">
                    ✔
                  </span>{" "}
                  {t("feature_collector_item")}
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 dark:text-green-400 mr-2">
                    ✔
                  </span>{" "}
                  {t("feature_secure_packaging")}
                </li>
                <li className="flex items-center">
                  <span className="text-green-500 dark:text-green-400 mr-2">
                    ✔
                  </span>{" "}
                  {t("feature_customer_support")}
                </li>
              </ul>
            </div>
          ) : (
            <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm line-clamp-2 text-justify flex-grow leading-relaxed">
              {t(product.descriptionKey)}
            </p>
          )}
        </div>

        <Button
          className="w-full bg-[#0d7a68] hover:bg-[#0a5c4d] text-white py-3 rounded-full font-semibold text-base sm:text-lg mt-auto shadow-md hover:shadow-lg transition-all duration-300"
          onClick={() => {
            const message = encodeURIComponent(
              `${t("whatsapp_order_greeting")} "${t(product.nameKey)}"\n` +
                `${t("whatsapp_order_id")} ${product.orderId}\n\n` +
                `${t("whatsapp_note")}\n` +
                `${t("whatsapp_payment_required")}\n` +
                `${t("whatsapp_send_proof")}\n` +
                `${t("whatsapp_record_unboxing")}`,
            );

            window.location.href = `https://wa.me/8562055058028?text=${message}`;
          }}
        >
          {t("shop_now")}
        </Button>
      </div>
    ));

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-10 py-16 md:py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="inline-block max-w-xl text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl text-[#0d7a68] dark:text-green-400 font-extrabold mb-3">
            {t("store")}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300">
            {t("store_page_intro")}
          </p>
        </div>

        {/* Omelette’s Products Section */}
        <h2 className="text-2xl sm:text-3xl text-[#0d7a68] dark:text-green-400 font-bold mb-6">
          Omelette&apos;s Airplane Models
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 pb-8">
          {renderProducts(airplaneProducts)}
        </div>

        {/* three_leaves Products Section */}
        <h2 className="text-2xl sm:text-3xl text-[#0d7a68] dark:text-green-400 font-bold mb-6 mt-16">
          three_leaves Collection
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 pb-8">
          {renderProducts(threeLeavesProducts)}
        </div>

        {/* Logistics and Payment Section */}
        <div className="flex flex-col items-center gap-6 mt-12 w-full max-w-3xl px-4">
          <Button
            className="flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-4 rounded-full text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-shadow duration-300"
            style={{ backgroundColor: "#0d7a68", color: "white" }}
            onClick={handleClick}
          >
            {t("logistics")} <AiFillTruck color="white" size={25} />
          </Button>

          {showNotice && (
            <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 shadow-lg text-sm sm:text-base md:text-lg max-w-md text-center animate-fade-in-down">
              ⚠️ <strong>{t("notice")}</strong> {t("complete_your_payment")}
              <div className="mt-4 sm:mt-5">
                <Link href="/logistics">
                  <button className="bg-[#0d7a68] hover:bg-[#0a5c4d] text-white flex items-center gap-2 px-5 py-2 rounded-full font-semibold shadow-md text-sm sm:text-base">
                    {t("i_have_paid_continue")}{" "}
                    <AiOutlineRight
                      className="hover:translate-x-1 transition-transform duration-200"
                      color="#ffffff"
                      size={25}
                    />
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>

        <p className="text-gray-600 dark:text-gray-300 mt-4 text-sm sm:text-base md:text-lg text-center">
          {t("accept_all_bank")}
        </p>

        {/* Bank Modals Section */}

        {/* Separator Line */}
        <div className="mt-12" data-aos="slide-up">
          <div className="h-1 w-64 sm:w-80 md:w-96 bg-[#0d7a68] dark:bg-green-600 rounded-full mx-auto transition-colors duration-300" />
        </div>
      </section>
    </DefaultLayout>
  );
}
