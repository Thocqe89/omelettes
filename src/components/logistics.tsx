import * as React from "react";

import DefaultLayout from "@/layouts/default";
import { useTranslation } from "react-i18next";
import Loading from "@/components/loading";
import { addToast } from "@heroui/toast";
import { BsCheck2All } from "react-icons/bs";
import { QRCodeSVG } from "qrcode.react";
import { Box, Paper } from "@mui/material";
import {   Button,  Input } from "@heroui/react";
import { FiDownload } from "react-icons/fi";
import html2canvas from "html2canvas";
import {Form} from "@heroui/form";


const WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbxK6TxvDKhMbYhK-vZyZH9s8PZrmMg5k9ETVQue0DzlRhg0eu6tEA-QvmIJzaHiOn46Ig/exec";

export default function Logistics() {
  const { t } = useTranslation();
  const [status, setStatus] = React.useState("");
  const [submittedData, setSubmittedData] = React.useState<Record<string, any> | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const qrRef = React.useRef<HTMLDivElement>(null);

const handleDownloadImage = async () => {
  if (qrRef.current) {
    const canvas = await html2canvas(qrRef.current);
    const link = document.createElement("a");
    link.download = `${submittedData?.id || "qr-code"}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
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
  };

    try {
      const response = await fetch(WEB_APP_URL, {
        method: "POST",
        body: new URLSearchParams(enhancedData as Record<string, string>),
      });

      const responseData = await response.json();
      setStatus(responseData.status);
      setSubmittedData({ ...enhancedData, status: responseData.status });

      form.reset();
    } catch (error) {
      console.error("Error:", error);
      setStatus("Error submitting data.");
      addToast({
        title: t("error"),
        description: t("toast_error_message"),
      });
    } finally {
      setIsLoading(false);
    }
    console.log("Submitting data:", enhancedData);
  };

  React.useEffect(() => {
    if (submittedData?.id && qrRef.current) {
      qrRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [submittedData]);

  if (isLoading) return <Loading />;

  return (
    <DefaultLayout>
      <section className="flex justify-center items-center min-h-screen py-10 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="w-full max-w-xl space-y-6">
          <h1 className="text-3xl font-bold text-center text-[#0d7a68]">
            {t("logistics")}
          </h1>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-[#0d7a68] p-6 md:p-8 space-y-6">
            <h2 className="text-lg font-semibold text-center text-gray-700 dark:text-white">
              {t("enter_your_information")}
            </h2>

            {status !== "Success" && (
              <Form className="space-y-8" onSubmit={onSubmit}>
                 <Input
                isRequired
                errorMessage={t("invalid_name") || "Please enter your name correctly"}
                label={t("name")}
                labelPlacement="inside"
                name="name"
                placeholder="tock"
                type="text"
              />

              <Input
                isRequired
                errorMessage={t("invalid_phone") || "Please enter a valid phone number"}
                label={t("phone")}
                labelPlacement="inside"
                name="phone"
                placeholder="2012345678"
                type="tel"
              />

              <Input
                isRequired
                label={t("province")}
                labelPlacement="inside"
                name="province"
                placeholder={t("enter_province") || "Enter province"}
                type="text"
              />

              <Input
                isRequired
                label={t("district")}
                labelPlacement="inside"
                name="district"
                placeholder={t("enter_district") || "Enter district"}
                type="text"
              />

              <Input
                isRequired
                label={t("village")}
                labelPlacement="inside"
                name="village"
                placeholder={t("enter_village") || "Enter village"}
                type="text"
              />

              <Input
                isRequired
                label={t("logistic_unit")}
                labelPlacement="inside"
                name="logistic_unit"
                placeholder={t("enter_logistic_unit") || "Enter hall unit"}
                type="text"
              />

              {/* New logistic info fields */}
              <Input
                isRequired
                label={t("logistic_name")}
                labelPlacement="inside"
                name="logistic_name"
                placeholder={t("enter_logistic_name") || "Enter logistic name"}
                type="text"
              />

              <Input
                isRequired
                label={t("logistic_address")}
                labelPlacement="inside"
                name="logistic_address"
                placeholder={t("enter_logistic_address") || "Enter logistic address"}
                type="text"
              />

              <Input
                isRequired
                label={t("logistic_phone")}
                labelPlacement="inside"
                name="logistic_phone"
                placeholder={t("enter_logistic_phone") || "Enter logistic phone"}
                type="tel"
              />

              <p className="text-1xl text-yellow-600 dark:text-yellow-400 font-medium">
                ⚠️ {t("double_check_warning")}
              </p>

              <Button type="submit" className="bg-[#0d7a68] text-white" fullWidth>
                {t("submit")}
              </Button>
              </Form>
            )}

            {status === "Success" && submittedData?.id && (
              <div
                ref={qrRef}
                className="p-6 rounded-2xl bg-green-50 border border-[#0d7a68] text-sm text-green-800 w-full max-w-2xl mx-auto"
              >
                <h3 className="font-bold text-lg mb-4 text-center">
                  {t("action_completed")}
                </h3>

                <ul className="space-y-4">
                  {/* Personal Details */}
                  
                  <li className="flex justify-between items-start">
                    <span className="font-semibold">{t("name")}: </span>
                    <span className="text-right break-words max-w-[60%]">{submittedData.name}</span>
                  </li>
                  <li className="flex justify-between items-start">
                    <span className="font-semibold">{t("phone")}: </span>
                    <span className="text-right break-words max-w-[60%]">{submittedData.phone}</span>
                  </li>
                  <li className="flex justify-between items-start">
                    <span className="font-semibold">{t("province")}: </span>
                    <span className="text-right break-words max-w-[60%]">{submittedData.province}</span>
                  </li>
                  <li className="flex justify-between items-start">
                    <span className="font-semibold">{t("district")}: </span>
                    <span className="text-right break-words max-w-[60%]">{submittedData.district}</span>
                  </li>
                  <li className="flex justify-between items-start">
                    <span className="font-semibold">{t("village")}: </span>
                    <span className="text-right break-words max-w-[60%]">{submittedData.village}</span>
                  </li>

                  {/* Red line separator */}
                  <li>
                    <hr className="border-[#0d7a68] border-t-2 my-2" />
                  </li>

                  {/* Logistic Details */}
                  <li className="flex justify-between items-start">
                    <span className="font-semibold">{t("logistic_unit")}: </span>
                    <span className="text-right break-words max-w-[60%]">{submittedData.logistic_unit}</span>
                  </li>
                  <li className="flex justify-between items-start">
                    <span className="font-semibold">{t("logistic_name")}: </span>
                    <span className="text-right break-words max-w-[60%]">{submittedData.logistic_name}</span>
                  </li>
                  <li className="flex justify-between items-start">
                    <span className="font-semibold">{t("logistic_address")}: </span>
                    <span className="text-right break-words max-w-[60%]">{submittedData.logistic_address}</span>
                  </li>
                  <li className="flex justify-between items-start">
                    <span className="font-semibold">{t("logistic_phone")}: </span>
                    <span className="text-right break-words max-w-[60%]">{submittedData.logistic_phone}</span>
                  </li>

                  {/* Red line separator */}
                  <li>
                    <hr className="border-[#0d7a68] border-t-2 my-2" />
                  </li>

                  {/* ID, Date, Status */}
                  <li className="flex justify-between items-start">
                    <span className="font-semibold">{t("id")}: </span>
                    <span className="text-right break-words max-w-[60%]">{submittedData.id}</span>
                  </li>
                  <li className="flex justify-between items-start">
                    <span className="font-semibold">{t("date")}: </span>
                    <span className="text-right break-words max-w-[60%]">{submittedData.date}</span>
                  </li>
                  <li className="flex justify-between items-start">
                    <span className="font-semibold">{t("status")}: </span>
                    <span className="text-right break-words max-w-[60%]">
                      {submittedData.status === "Success" ? (
                        <span className="flex items-center gap-1">
                          <p className="text-default-500">Form submitted successfully</p> |{" "}
                          <BsCheck2All size={23} color="#0d7a68" />
                        </span>
                      ) : (
                        submittedData.status
                      )}
                    </span>
                  </li>
                </ul>

                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    mt: 2,
                    borderRadius: 3,
                    border: "1px solid #0d7a68",
                  }}
                >
                  <Box
                    sx={{
                      borderRadius: 3,
                      textAlign: "center",
                      bgcolor: "white",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      id="qr-code"
                      sx={{
                        p: 1,
                        bgcolor: "white",
                        borderRadius: 2,
                        mt: 2,
                        position: "relative",
                        width: 200,
                        height: 200,
                      }}
                    >
                      <QRCodeSVG
                        value={`${submittedData.id}`}
                        size={200}
                        level="H"
                        fgColor="#0d7a68"
                        bgColor="#ffffff"
                      />
                      <img
                        src="/image/logo01.png"
                        alt="Logo"
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          width: 40,
                          height: 40,
                          borderRadius: "8px",
                          background: "white",
                          padding: 4,
                        }}
                      />
                    </Box>

                    {/* <Button
                      className="mt-4 bg-[#0d7a68] text-white"
                      size="sm"
                      onClick={() => {
                        const canvas = document.querySelector("#qr-code canvas") as HTMLCanvasElement | null;
                        if (!canvas) return;
                        const ctx = canvas.getContext("2d");
                        if (!ctx) return;

                        // Clear area below QR code before drawing
                        ctx.clearRect(0, 180, canvas.width, 200);

                        ctx.fillStyle = "#0d7a68";
                        ctx.font = "14px Arial";
                        ctx.textAlign = "center";

                        const baseY = 180;
                        const lineHeight = 20;

                        // Draw text info below QR code
                        ctx.fillText(`ID: ${submittedData.id}`, canvas.width / 2, baseY);
                        ctx.fillText(
                          `Name: ${submittedData.name || "-"}`,
                          canvas.width / 2,
                          baseY + lineHeight
                        );
                        ctx.fillText(
                          `Phone: ${submittedData.phone || "-"}`,
                          canvas.width / 2,
                          baseY + lineHeight * 2
                        );
                        ctx.fillText(
                          `Logistic Unit: ${submittedData.logistic_unit || "-"}`,
                          canvas.width / 2,
                          baseY + lineHeight * 3
                        );
                        ctx.fillText(
                          `Logistic Name: ${submittedData.logistic_name || "-"}`,
                          canvas.width / 2,
                          baseY + lineHeight * 4
                        );
                        ctx.fillText(
                          `Logistic Phone: ${submittedData.logistic_phone || "-"}`,
                          canvas.width / 2,
                          baseY + lineHeight * 5
                        );
                        ctx.fillText(
                          `Address: ${submittedData.logistic_address || "-"}`,
                          canvas.width / 2,
                          baseY + lineHeight * 6
                        );

                        // Download image
                        const link = document.createElement("a");
                        link.download = `${submittedData.id}_qr.png`;
                        link.href = canvas.toDataURL("image/png");
                        link.click();
                      }}
                      variant="bordered"
                    >
                      <FiDownload style={{ marginRight: 8 }} />
                      {t("download_qr_code")}
                    </Button> */}
                  </Box>
                </Paper>
                <div className="flex justify-center mt-4">
  <Button
    onClick={handleDownloadImage}
    className="bg-[#0d7a68] text-white flex items-center gap-2"
  >
    <FiDownload size={18} />
    {t("download_qr_image")}
  </Button>
</div>

              </div>
            )}
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
