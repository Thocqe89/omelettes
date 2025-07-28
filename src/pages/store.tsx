import DefaultLayout from "@/layouts/default";
import * as React from "react";
import { useTranslation } from "react-i18next";

import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/modal";
import { useState } from "react";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { AiFillTruck } from "react-icons/ai";
import { AiOutlineRight, AiOutlinePlusCircle, AiOutlineMinusCircle } from "react-icons/ai";
import 'aos/dist/aos.css';
import { Image } from "@heroui/image";


export default function StorePage() {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState<string | null>(null);
  const handleOpen = (modalName: string) => () => setOpenModal(modalName);
  const handleClose = () => setOpenModal(null);
  const imgbcel = "/image/10.png"; // Make sure these paths are correct
  const imgjdb = "/image/8.png";
  const imgldb = "/image/9.png";

  const [showNotice, setShowNotice] = React.useState(false);
  const handleClick = () => {
    setShowNotice(true);
  };

  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);

  const toggleExpand = (productName: string) => {
    setExpandedProduct(prev => (prev === productName ? null : productName));
  };

  const productList = [
    {
      id: "comac_c919",
      nameKey: "product_comac_c919_name",
      descriptionKey: "product_comac_c919_description",
      priceKey: "price_comac",
      imageSrc: "c919/p1.png",
      orderId: "OMS202501",
      isNew: true
    },
    {
      id: "qatar_777",
      nameKey: "product_qatar_777_name",
      descriptionKey: "product_qatar_777_description",
      priceKey: "price_qatar",
      imageSrc: "c919/p3.png",
      orderId: "OMS202502"
    },
    {
      id: "antonov_an225",
      nameKey: "product_antonov_an225_name",
      descriptionKey: "product_antonov_an225_description",
      priceKey: "price_antonov",
      imageSrc: "c919/p2.png",
      orderId: "OMS202503"
    },
    {
      id: "china_eastern_c919",
      nameKey: "product_china_eastern_c919_name",
      descriptionKey: "product_china_eastern_c919_description",
      priceKey: "price_china_eastern",
      imageSrc: "c919/p4.png",
      orderId: "OMS202504",
      isNew: true
    }
  ];

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-10 py-16 md:py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <div className="inline-block max-w-xl text-center">
       
        
          <h1 className="text-3xl sm:text-4xl lg:text-5xl text-[#0d7a68] dark:text-green-400 font-extrabold text-center mb-3">
            {t("store")}
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300">
            {t("store_page_intro")}
          </p>
        </div>

        {/* --- Responsive Grid Container for Product Cards --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 pb-8">
          {productList.map(product => (
            <div
              key={product.id}
              // Card container: consistent height, flex column, responsive width
              // No longer flex-shrink-0 or min-w classes as grid handles sizing
              className="group flex flex-col justify-between
                         h-[580px] md:h-[650px]
                         bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-md
                         hover:shadow-lg hover:scale-[1.02] transition-all duration-300 relative overflow-hidden
                         border-2 border-[#0d7a68] dark:border-green-600"
              data-aos="fade-up"
            >
              {/* Optional: "New Arrival" Badge */}
              {product.isNew && (
                <span className="absolute top-0 right-0 mt-6 mr-6 bg-green-500 text-white text-xs sm:text-sm font-bold px-3 py-1 rounded-full z-10 animate-pulse">
                  {t("new_arrival")}
                </span>
              )}

              {/* Product Image Section */}
              <div className="flex justify-center items-center h-2/5 md:h-1/2 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-700 mb-4">
                <Image
                  src={product.imageSrc}
                  isZoomed
                  alt={t(product.nameKey)}
                  className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Product Info Section */}
              <div className="flex flex-col items-center text-center flex-grow">
                <h2 className="text-xl sm:text-2xl text-gray-800 dark:text-gray-100 font-semibold mb-2 break-words leading-tight">
                  {t(product.nameKey)}
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-gray-500 dark:text-gray-400 mb-4 font-medium">{t("price")}</p>
                <p className="text-3xl sm:text-4xl text-green-700 dark:text-green-400 font-extrabold mb-4">{t(product.priceKey)}</p>

                {/* Expand/Collapse Button */}
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

                {/* Collapsible Content */}
                {expandedProduct === product.id ? (
                  <div className="mt-4 animate-fade-in-down flex-grow overflow-y-auto pr-2 custom-scrollbar text-gray-700 dark:text-gray-200 text-sm md:text-base">
                    <p className="mb-4 text-justify leading-relaxed">
                      {t(product.descriptionKey)}
                    </p>
                    <ul className="space-y-2 mb-4 text-left px-2 md:px-4">
                      <li className="flex items-center">
                        <span className="text-green-500 dark:text-green-400 mr-2">✔</span> {t("feature_high_quality")}
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 dark:text-green-400 mr-2">✔</span> {t("feature_detailed_design")}
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 dark:text-green-400 mr-2">✔</span> {t("feature_perfect_display")}
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 dark:text-green-400 mr-2">✔</span> {t("feature_collector_item")}
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 dark:text-green-400 mr-2">✔</span> {t("feature_secure_packaging")}
                      </li>
                      <li className="flex items-center">
                        <span className="text-green-500 dark:text-green-400 mr-2">✔</span> {t("feature_customer_support")}
                      </li>
                    </ul>
                  </div>
                ) : (
                  // Truncated description when not expanded for a clean look
                  <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm line-clamp-2 text-justify flex-grow leading-relaxed">
                    {t(product.descriptionKey)}
                  </p>
                )}
              </div>

              {/* Shop Now Button - always at the bottom */}
              <Button
                className="w-full bg-[#0d7a68] hover:bg-[#0a5c4d] text-white py-3 rounded-full font-semibold text-base sm:text-lg mt-auto shadow-md hover:shadow-lg transition-all duration-300"
                onClick={() => {
                  const message = encodeURIComponent(
                    `${t("whatsapp_order_greeting")} "${t(product.nameKey)}"\n` +
                    `${t("whatsapp_order_id")} ${product.orderId}\n\n` +
                    `${t("whatsapp_note")}\n` +
                    `${t("whatsapp_payment_required")}\n` +
                    `${t("whatsapp_send_proof")}\n` +
                    `${t("whatsapp_record_unboxing")}`
                  );
                  window.location.href = `https://wa.me/8562055058028?text=${message}`;
                }}
              >
                {t("shop_now")}
              </Button>
            </div>
          ))}
        </div>
        {/* --- End Responsive Grid Container --- */}

        {/* Logistics and Payment Section */}
        <div className="flex flex-col items-center gap-6 mt-12 w-full max-w-3xl px-4">
          <Button
            style={{ backgroundColor: "#0d7a68", color: "white" }}
            onClick={handleClick}
            className="flex items-center gap-2 px-6 py-3 sm:px-8 sm:py-4 rounded-full text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            {t("logistics")} <AiFillTruck color="white" size={25} />
          </Button>

          {showNotice && (
            <div
              className="mb-6 p-4 sm:p-5 rounded-2xl bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 shadow-lg text-sm sm:text-base md:text-lg max-w-md text-center animate-fade-in-down"
            >
              ⚠️ <strong>{t("notice")}</strong> {t("complete_your_payment")}
              <div className="mt-4 sm:mt-5">
                <Link href="/logistics">
                  <button
                    className="bg-[#0d7a68] hover:bg-[#0a5c4d] text-white flex items-center gap-2 px-5 py-2  rounded-full font-semibold shadow-md text-sm sm:text-base"

                  >
                    {t("i_have_paid_continue")} <AiOutlineRight className="hover:translate-x-1 transition-transform duration-200" size={25} color="#ffffff" />
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
        <div className="flex justify-center gap-4 sm:gap-6 mt-8">
          {/* JDB Button + Modal */}
          <button onClick={handleOpen('jdb')} className="transform hover:scale-110 transition-transform duration-200">
            <Image src="/image/jdb.png" alt="JDB" width={50} height={50} className="sm:w-60 sm:h-60" />
          </button>
          <Modal isOpen={openModal === 'jdb'} onOpenChange={handleClose}>
            <ModalContent className="w-full max-w-md sm:max-w-xl p-4 sm:p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100">
              <>
                <ModalHeader className="flex items-center justify-between text-xl sm:text-2xl text-[#0d7a68] dark:text-green-400 font-bold pb-3 sm:pb-4 border-b border-gray-200 dark:border-gray-700">
                  JDB Bank QR Code
                </ModalHeader>
                <ModalBody className="flex flex-col items-center gap-3 sm:gap-4 py-4 sm:py-6">
                  <Image
                    isBlurred
                    className="w-full max-w-[250px] sm:max-w-[300px] h-auto rounded-lg shadow-md"
                    src={imgjdb}
                    alt="JDB Bank QR Code"
                  />
                  <p className="text-sm sm:text-base text-gray-700 dark:text-gray-200 text-center">{t("scan_to_pay")}</p>
                </ModalBody>
              </>
            </ModalContent>
          </Modal>

          {/* BCEL Button + Modal */}
          <button onClick={handleOpen('bcel')} className="transform hover:scale-110 transition-transform duration-200">
            <Image src="/image/bcel.png" alt="BCEL" width={50} height={50} className="sm:w-60 sm:h-60" />
          </button>
          <Modal isOpen={openModal === 'bcel'} onOpenChange={handleClose}>
            <ModalContent className="w-full max-w-md sm:max-w-xl p-4 sm:p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100">
              <>
                <ModalHeader className="flex items-center justify-between text-xl sm:text-2xl text-[#0d7a68] dark:text-green-400 font-bold pb-3 sm:pb-4 border-b border-gray-200 dark:border-gray-700">BCEL Bank QR Code</ModalHeader>
                <ModalBody className="flex flex-col items-center gap-3 sm:gap-4 py-4 sm:py-6">
                  <Image
                    isBlurred
                    className="w-full max-w-[250px] sm:max-w-[300px] h-auto rounded-lg shadow-md"
                    src={imgbcel}
                    alt="BCEL Bank QR Code"
                  />
                  <p className="text-sm sm:text-base text-gray-700 dark:text-gray-200 text-center">{t("scan_to_pay")}</p>
                </ModalBody>
              </>
            </ModalContent>
          </Modal>

          {/* LDB Button + Modal */}
          <button onClick={handleOpen('ldb')} className="transform hover:scale-110 transition-transform duration-200">
            <Image src="/image/ldb.png" alt="LDB" width={50} height={50} className="sm:w-60 sm:h-60" />
          </button>
          <Modal isOpen={openModal === 'ldb'} onOpenChange={handleClose}>
            <ModalContent className="w-full max-w-md sm:max-w-xl p-4 sm:p-6 rounded-xl shadow-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100">
              <>
                <ModalHeader className="flex items-center justify-between text-xl sm:text-2xl text-[#0d7a68] dark:text-green-400 font-bold pb-3 sm:pb-4 border-b border-gray-200 dark:border-gray-700">LDB Bank QR Code</ModalHeader>
                <ModalBody className="flex flex-col items-center gap-3 sm:gap-4 py-4 sm:py-6">
                  <Image
                    isBlurred
                    className="w-full max-w-[250px] sm:max-w-[300px] h-auto rounded-lg shadow-md"
                    src={imgldb}
                    alt="LDB Bank QR Code"
                  />
                  <p className="text-sm sm:text-base text-gray-700 dark:text-gray-200 text-center">{t("scan_to_pay")}</p>
                </ModalBody>
              </>
            </ModalContent>
          </Modal>
        </div>

        {/* Separator Line */}
        <div data-aos="slide-up" className="mt-12">
          <div className="h-1 w-64 sm:w-80 md:w-96 bg-[#0d7a68] dark:bg-green-600 rounded-full mx-auto transition-colors duration-300"></div>
        </div>
      </section>
    </DefaultLayout>
  );
}