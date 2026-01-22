import * as React from "react";
import { useTranslation } from "react-i18next";
import { addToast } from "@heroui/toast";
import { BsCheck2All, BsDownload, BsQrCode, BsTruck, BsPerson, BsCheckCircleFill } from "react-icons/bs";
import { QRCodeSVG } from "qrcode.react";
import { Button, Input, Card, CardBody, CardHeader, Divider, Badge, Spinner } from "@heroui/react";
import { FiDownload, FiUser, FiMapPin, FiTruck, FiCheckCircle } from "react-icons/fi";
import html2canvas from "html2canvas";

import DefaultLayout from "@/layouts/default";

const WEB_APP_POST_URL = import.meta.env.VITE_GOOGLE_SHEET_URL;

export default function Logistics() {
  const { t } = useTranslation();
  const [status, setStatus] = React.useState("");
  const [submittedData, setSubmittedData] = React.useState<Record<string, any> | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [activeStep, setActiveStep] = React.useState(1);
  const [showSuccessBanner, setShowSuccessBanner] = React.useState(false);
  const qrRef = React.useRef<HTMLDivElement>(null);

  const handleDownloadImage = async () => {
    if (qrRef.current) {
      try {
        qrRef.current.classList.add("downloading-styles");
        
        const canvas = await html2canvas(qrRef.current, {
          backgroundColor: "#ffffff",
          useCORS: true,
          scale: 3,
        });
        const link = document.createElement("a");
        link.download = `${submittedData?.id || "qr-code"}.png`;
        link.href = canvas.toDataURL("image/png");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        qrRef.current.classList.remove("downloading-styles");
        
        addToast({
          title: t("download_success"),
          description: t("qr_downloaded"),
          color: "success",
        });
      } catch (error) {
        addToast({
          title: t("error"),
          description: t("download_error"),
          color: "danger",
        });
      }
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const now = new Date();
    const datePart = now.toISOString().slice(0, 10).replace(/-/g, "");
    const timePart = now.toTimeString().slice(0, 8).replace(/:/g, "");
    const id = `OMS-${datePart}-${timePart}`;
    const enhancedData = {
      ...data,
      id,
      date: now.toLocaleDateString(),
      timestamp: now.toLocaleString(),
    };

    try {
      const response = await fetch(WEB_APP_POST_URL, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(enhancedData as Record<string, string>),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const responseData = await response.json();
      
      // Show success banner
      setShowSuccessBanner(true);
      
      // Wait a moment then show success state
      setTimeout(() => {
        setStatus("Success");
        setSubmittedData({ ...enhancedData, status: responseData.status });
        setActiveStep(3);
        setShowSuccessBanner(false);
        form.reset();
      }, 1500);

      addToast({
        title: t("success"),
        description: t("form_submitted_successfully"),
        color: "success",
        icon: <FiCheckCircle className="w-6 h-6" />,
      });
    } catch (error) {
      setStatus("Error submitting data.");
      addToast({
        title: t("error"),
        description: t("toast_error_message"),
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (submittedData?.id && qrRef.current) {
      setTimeout(() => {
        qrRef.current?.scrollIntoView({ 
          behavior: "smooth",
          block: "center"
        });
      }, 300);
    }
  }, [submittedData]);

  return (
    <DefaultLayout>
      <section className="min-h-screen py-4 px-4 md:py-8 bg-gradient-to-b from-white via-gray-50 to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        {/* Success Banner */}
        {showSuccessBanner && (
          <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-slideDown">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 min-w-[300px]">
              <div className="animate-spin-slow">
                <BsCheckCircleFill className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold">{t("processing_submission") || "Processing Submission..."}</h3>
                <p className="text-sm opacity-90">{t("generating_qr") || "Generating QR Code and saving data"}</p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="max-w-6xl mx-auto mb-6 md:mb-8 text-center">
          <div className="inline-flex items-center gap-2 mb-2">
            <div className="p-2 bg-gradient-to-r from-[#0d7a68] to-[#10b981] rounded-xl">
              <BsTruck className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#0d7a68] to-[#10b981] bg-clip-text text-transparent">
              {t("logistics_management")}
            </h1>
          </div>
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t("logistics_description")}
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Progress Steps - Smaller */}
          <div className="mb-6 md:mb-8">
            <div className="flex items-center justify-center">
              <div className="flex items-center w-full max-w-md">
                {[1, 2, 3].map((step) => (
                  <React.Fragment key={step}>
                    <div className="flex flex-col items-center">
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300
                        ${activeStep >= step 
                          ? 'bg-[#0d7a68] text-white shadow-md scale-110' 
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                        }
                      `}>
                        {step}
                      </div>
                      <span className="text-xs mt-1 font-medium">
                        {step === 1 ? t("customer_info") : 
                         step === 2 ? t("logistics") : 
                         t("confirmation")}
                      </span>
                    </div>
                    {step < 3 && (
                      <div className={`flex-1 h-1 mx-2 transition-all duration-500 ${activeStep > step ? 'bg-[#0d7a68]' : 'bg-gray-300 dark:bg-gray-600'}`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          {status !== "Success" ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              {/* Left Panel - Form */}
              <div className="lg:col-span-2">
                <Card className="border border-gray-200 dark:border-gray-700 shadow-lg rounded-2xl">
                  <CardHeader className="px-4 md:px-6 pt-4 md:pt-6 pb-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-[#0d7a68]/10 rounded-lg">
                        <FiUser className="w-5 h-5 text-[#0d7a68]" />
                      </div>
                      <div>
                        <h2 className="text-lg md:text-xl font-bold text-gray-800 dark:text-white">
                          {t("enter_your_information")}
                        </h2>
                        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300">
                          {t("fill_all_fields")}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardBody className="px-4 md:px-6 py-4">
                    <form className="space-y-4 md:space-y-6" onSubmit={onSubmit}>
                      {/* Customer Information */}
                      <div className="space-y-4">
                        <h3 className="text-sm md:text-base font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                          <FiUser className="w-4 h-4 text-[#0d7a68]" />
                          {t("customer_information")}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                          <Input
                            isRequired
                            errorMessage={t("invalid_name")}
                            label={t("name")}
                            labelPlacement="outside"
                            name="name"
                            placeholder="John Doe"
                            type="text"
                            variant="bordered"
                            size="sm"
                            disabled={isLoading}
                          />
                          <Input
                            isRequired
                            errorMessage={t("invalid_phone")}
                            label={t("phone")}
                            labelPlacement="outside"
                            name="phone"
                            placeholder="2012345678"
                            type="tel"
                            variant="bordered"
                            size="sm"
                            disabled={isLoading}
                          />
                        </div>
                      </div>

                      {/* Address */}
                      <div className="space-y-4">
                        <h3 className="text-sm md:text-base font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                          <FiMapPin className="w-4 h-4 text-[#0d7a68]" />
                          {t("delivery_address")}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                          <Input
                            isRequired
                            label={t("province")}
                            labelPlacement="outside"
                            name="province"
                            placeholder={t("enter_province")}
                            type="text"
                            variant="bordered"
                            size="sm"
                            disabled={isLoading}
                          />
                          <Input
                            isRequired
                            label={t("district")}
                            labelPlacement="outside"
                            name="district"
                            placeholder={t("enter_district")}
                            type="text"
                            variant="bordered"
                            size="sm"
                            disabled={isLoading}
                          />
                          <Input
                            isRequired
                            label={t("village")}
                            labelPlacement="outside"
                            name="village"
                            placeholder={t("enter_village")}
                            type="text"
                            variant="bordered"
                            size="sm"
                            disabled={isLoading}
                          />
                        </div>
                      </div>

                      {/* Logistics */}
                      <div className="space-y-4">
                        <h3 className="text-sm md:text-base font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                          <FiTruck className="w-4 h-4 text-[#0d7a68]" />
                          {t("logistics_details")}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                          <Input
                            isRequired
                            label={t("logistic_name")}
                            labelPlacement="outside"
                            name="logistic_name"
                            placeholder={t("enter_logistic_name")}
                            type="text"
                            variant="bordered"
                            size="sm"
                            disabled={isLoading}
                          />
                          <Input
                            isRequired
                            label={t("logistic_unit")}
                            labelPlacement="outside"
                            name="logistic_unit"
                            placeholder={t("enter_logistic_unit")}
                            type="text"
                            variant="bordered"
                            size="sm"
                            disabled={isLoading}
                          />
                          <Input
                            isRequired
                            label={t("logistic_phone")}
                            labelPlacement="outside"
                            name="logistic_phone"
                            placeholder={t("enter_logistic_phone")}
                            type="tel"
                            variant="bordered"
                            size="sm"
                            disabled={isLoading}
                          />
                        </div>
                      </div>

                      {/* Warning */}
                      <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                        <div className="flex items-start gap-2">
                          <span className="text-yellow-600 dark:text-yellow-400 text-sm">⚠️</span>
                          <p className="text-xs text-yellow-800 dark:text-yellow-300">
                            {t("double_check_warning")}
                          </p>
                        </div>
                      </div>

                      <Button
                        fullWidth
                        className="bg-gradient-to-r from-[#0d7a68] to-[#10b981] text-white font-semibold py-3 md:py-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                        type="submit"
                        size="md"
                        isLoading={isLoading}
                        spinner={
                          <div className="flex items-center gap-2">
                            <Spinner size="sm" color="white" />
                            <span>{t("submitting") || "Submitting..."}</span>
                          </div>
                        }
                      >
                        {isLoading ? "" : t("submit_information")}
                      </Button>

                      {/* Submitting Status */}
                      {isLoading && !showSuccessBanner && (
                        <div className="text-center">
                          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <Spinner size="sm" color="primary" />
                            <span className="text-sm text-blue-600 dark:text-blue-400">
                              {t("submitting_data") || "Submitting your data..."}
                            </span>
                          </div>
                        </div>
                      )}
                    </form>
                  </CardBody>
                </Card>
              </div>

              {/* Right Panel - Preview */}
              <div className="lg:col-span-1">
                <Card className="border border-gray-200 dark:border-gray-700 shadow-lg rounded-2xl h-full">
                  <CardBody className="flex flex-col items-center justify-center p-4 md:p-6 text-center">
                    <div className="p-4 bg-gradient-to-r from-[#0d7a68] to-[#10b981] rounded-xl mb-4">
                      <BsQrCode className="w-12 h-12 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                      {t("qr_code_ready")}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                      {t("qr_code_description")}
                    </p>
                    <div className="space-y-2 text-left w-full">
                      <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="p-1.5 bg-green-100 dark:bg-green-900 rounded">
                          <FiUser className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-300">{t("customer_info")}</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="p-1.5 bg-blue-100 dark:bg-blue-900 rounded">
                          <FiTruck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-300">{t("logistics_info")}</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="p-1.5 bg-purple-100 dark:bg-purple-900 rounded">
                          <BsCheck2All className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-300">{t("instant_qr")}</span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>
          ) : (
            /* SUCCESS STATE - Centered and Responsive */
            <div className="flex justify-center items-start min-h-[60vh] animate-fadeIn">
              <div ref={qrRef} className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl">
                <Card className="border border-gray-200 dark:border-gray-700 shadow-xl rounded-2xl overflow-hidden">
                  <div className="bg-gradient-to-r from-[#0d7a68] to-[#10b981] p-4 md:p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-xl animate-pulse-slow">
                          <BsCheck2All className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="text-lg md:text-xl font-bold">{t("success")}</h3>
                          <p className="text-xs md:text-sm opacity-90">{t("order_created")}</p>
                        </div>
                      </div>
                      <Badge color="success" variant="solid" size="sm">
                        {t("completed")}
                      </Badge>
                    </div>
                  </div>
                  
                  <CardBody className="p-4 md:p-6">
                    {/* QR Code Display - Always White Background */}
                    <div className="mb-4 animate-scaleIn">
                      <div className="bg-white p-4 rounded-xl border border-gray-200">
                        <div className="relative mx-auto w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64">
                          <QRCodeSVG
                            value={submittedData?.id || ""}
                            size={256}
                            level="H"
                            includeMargin={true}
                            bgColor="#FFFFFF"
                            fgColor="#000000"
                            className="w-full h-full"
                          />
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-lg p-1 shadow-sm">
                            <img
                              alt="Logo"
                              src="https://res.cloudinary.com/deahgtn57/image/upload/v1751616678/omelett%27s/public/image/ChatGPT_Image_Jun_29_2025_02_29_59_PM_vmvihs.png"
                              crossOrigin="anonymous"
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-center text-gray-600 dark:text-gray-400 mt-2">
                        {t("scan_qr_info") || "Scan to view shipment details"}
                      </p>
                    </div>

                    {/* Order Details */}
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg animate-slideInRight">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{t("order_id")}</span>
                        <span className="text-sm font-mono font-bold text-[#0d7a68] truncate">
                          {submittedData?.id}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg animate-slideInRight" style={{animationDelay: "0.1s"}}>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{t("customer")}</span>
                        <span className="text-sm font-medium truncate">{submittedData?.name}</span>
                      </div>

                      <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg animate-slideInRight" style={{animationDelay: "0.2s"}}>
                        <div className="flex items-center gap-2 mb-1">
                          <BsTruck className="w-3.5 h-3.5 text-gray-500" />
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                            {t("delivery_to")}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {submittedData?.village}, {submittedData?.district}, {submittedData?.province}
                        </p>
                      </div>
                    </div>

                    <Divider className="my-4" />

                    <div className="space-y-3">
                      <Button
                        fullWidth
                        className="bg-gradient-to-r from-[#0d7a68] to-[#10b981] text-white font-semibold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 animate-bounceIn"
                        onClick={handleDownloadImage}
                        startContent={<BsDownload className="w-4 h-4" />}
                      >
                        {t("download_qr_code")}
                      </Button>

                      <Button
                        fullWidth
                        variant="bordered"
                        className="border-gray-300 dark:border-gray-600 py-3 hover:scale-[1.02] transition-all duration-300"
                        onClick={() => {
                          setSubmittedData(null);
                          setStatus("");
                          setActiveStep(1);
                        }}
                      >
                        {t("create_new_order")}
                      </Button>
                    </div>

                    {/* QR Info Note */}
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                      <div className="flex items-start gap-2">
                        <span className="text-blue-600 dark:text-blue-400 text-sm">ℹ️</span>
                        <p className="text-xs text-blue-800 dark:text-blue-300">
                          {t("qr_contains_details") || "QR contains shipment details. Scan with any QR scanner app."}
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </div>
            </div>
          )}
        </div>

        {/* Stats Bar - Only show when not in success state */}
        {status !== "Success" && (
          <div className="max-w-6xl mx-auto mt-6 md:mt-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { icon: "✓", title: t("instant_qr_generation") },
                { icon: "🔒", title: t("secure_data") },
                { icon: "⚡", title: t("fast_processing") },
                { icon: "📱", title: t("mobile_friendly") },
              ].map((item, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-sm text-center hover:scale-105 transition-transform duration-300">
                  <div className="text-lg md:text-xl mb-1">{item.icon}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">{item.title}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      <style>{`
        @keyframes slideDown {
          from {
            transform: translate(-50%, -100%);
            opacity: 0;
          }
          to {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }

        @keyframes spinSlow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.8);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes slideInRight {
          from {
            transform: translateX(20px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes bounceIn {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        @keyframes pulseSlow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        .animate-slideDown {
          animation: slideDown 0.5s ease-out;
        }

        .animate-spin-slow {
          animation: spinSlow 2s linear infinite;
        }

        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out;
        }

        .animate-scaleIn {
          animation: scaleIn 0.6s ease-out;
        }

        .animate-slideInRight {
          animation: slideInRight 0.5s ease-out;
          animation-fill-mode: both;
        }

        .animate-bounceIn {
          animation: bounceIn 0.6s ease-out;
        }

        .animate-pulse-slow {
          animation: pulseSlow 2s ease-in-out infinite;
        }

        .downloading-styles {
          background-color: white !important;
        }
        
        .downloading-styles * {
          background-color: white !important;
          color: black !important;
        }
        
        .downloading-styles .bg-gradient-to-r {
          background: linear-gradient(to right, #0d7a68, #10b981) !important;
        }
        
        .downloading-styles .bg-white {
          background: white !important;
        }
        
        .downloading-styles .bg-gray-50 {
          background: #f9fafb !important;
        }
      `}</style>
    </DefaultLayout>
  );
}