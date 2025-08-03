import * as React from "react";
import { useTranslation } from "react-i18next";
import { useState, useRef } from "react";
import { QrReader } from "react-qr-reader";
import jsQR from "jsqr";
import { RiQrScan2Line } from "react-icons/ri";
import { Button } from "@heroui/button";
import { MdOutlineQrCodeScanner } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";
import { IoCloseOutline } from "react-icons/io5";
import { MdClear } from "react-icons/md";

import Loading from "@/components/loading";
import DefaultLayout from "@/layouts/default";

interface EntryData {
  id?: string;
  phone?: string;
  [key: string]: string | undefined;
}

const WEB_APP_POST_URL = import.meta.env.VITE_GOOGLE_SHEET_URL;

export default function DataCheck() {
  const { t } = useTranslation();
  const [scanResult, setScanResult] = useState<string>("");
  const [entry, setEntry] = useState<EntryData[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [useCamera, setUseCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [phoneSearch, setPhoneSearch] = useState<string>("");
  const [displayPhoneSearch, setDisplayPhoneSearch] = useState<string>("");

  const normalizeKey = (key: string) => key.trim().toLowerCase();

  const maskPhoneNumber = (phone: string): string => {
    if (!phone || phone.length <= 3) return phone;
    const visiblePart = phone.slice(-3);
    return '*'.repeat(phone.length - 3) + visiblePart;
  };
const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const input = e.target.value;
  const numbersOnly = input.replace(/\D/g, "");

  // Update real value
  setPhoneSearch(numbersOnly);

  // Mask each digit with "*"
  setDisplayPhoneSearch("*".repeat(numbersOnly.length));
};





  const fetchEntry = async (
    searchValue: string,
    keyToMatch: "id" | "phone",
  ) => {
    if (!searchValue) return;
    setLoading(true);
    setEntry(null);
    setUseCamera(false);

    try {
      const res = await fetch(WEB_APP_POST_URL);
      const data: any[] = await res.json();

      const matchedEntries = data.filter((item: any) => {
        const normalized = Object.keys(item).reduce(
          (acc, key) => {
            acc[normalizeKey(key)] = item[key];
            return acc;
          },
          {} as Record<string, string>,
        );

        return String(normalized[keyToMatch] || "")
          .trim()
          .includes(searchValue.trim());
      });

      setEntry(matchedEntries.length > 0 ? matchedEntries : []);
      setScanResult(searchValue);
    } catch (err) {
      console.error("Fetch error:", err);
      alert(t("fetch_error_message") || "An error occurred while fetching data.");
      setEntry([]);
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setScanResult("");
    setPhoneSearch("");
    setDisplayPhoneSearch("");
    setEntry(null);
    setUseCamera(false);
  };

  const handleQrScan = (result: any) => {
    if (result?.getText) {
      const id = result.getText();
      setScanResult(id);
      fetchEntry(id, "id");
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setEntry(null);
    setLoading(true);

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.src = objectUrl;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        alert(t("canvas_not_supported") || "⚠️ Canvas not supported.");
        URL.revokeObjectURL(objectUrl);
        setLoading(false);
        return;
      }

      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const qrCode = jsQR(imageData.data, canvas.width, canvas.height);

      if (qrCode?.data) {
        fetchEntry(qrCode.data, "id");
      } else {
        alert(t("no_qr_code_found") || "❌ No QR code found in the image.");
        setLoading(false);
        setEntry([]);
      }

      URL.revokeObjectURL(objectUrl);
    };
    img.onerror = () => {
      alert(t("failed_to_load_image") || "⚠️ Failed to load image.");
      URL.revokeObjectURL(objectUrl);
      setLoading(false);
      setEntry([]);
    };
  };

  return (
    <DefaultLayout>
      <section className="min-h-screen px-4 py-10">
        <div className="max-w-xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold text-center text-[#0d7a68]">
            {t("order_details") || "Scan QR Code"}
          </h1>

          <div className="flex gap-2">
    <div className="flex items-center gap-2 w-full">
  <input
  className="flex-grow p-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-green-800"
  placeholder={t("enter_phone_number") || "Enter phone number"}
  style={{ borderColor: "#0d7a68" }}
  type="text"
  value={"*".repeat(phoneSearch.length)} // show masked input
  onChange={(e) => {
    const input = e.target.value;
    const prevLength = phoneSearch.length;
    const nextLength = input.length;

    if (nextLength < prevLength) {
      // User deleted some characters
      setPhoneSearch((prev) => prev.slice(0, nextLength));
      return;
    }

    // Get last char typed, allow only digits
    const lastChar = input[input.length - 1];
    if (!/\d/.test(lastChar)) return;

    setPhoneSearch((prev) => (prev + lastChar).slice(0, 20)); // limit max length
  }}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      fetchEntry(phoneSearch, "phone");
    }
  }}
  onClick={(e) => {
    const target = e.target as HTMLInputElement;
    target.selectionStart = target.selectionEnd = target.value.length;
  }}
  onFocus={(e) => {
    const target = e.target as HTMLInputElement;
    target.selectionStart = target.selectionEnd = target.value.length;
  }}
/>



  <Button
    aria-label={t("search_phone") || "Search phone number"}
    style={{ backgroundColor: "#0d7a68" }}
    onClick={() => fetchEntry(phoneSearch, "phone")}
  >
    <AiOutlineSearch
      className="hover:animate-zoom-out"
      color="#ffffff"
      size={30}
    />
  </Button>
</div>


           

          </div>

          <div className="flex justify-center gap-4">
            <Button
              aria-label={t("scan_with_camera") || "Scan with camera"}
              style={{ backgroundColor: "#0d7a68" }}
              onClick={() => setUseCamera(true)}
            >
              <RiQrScan2Line
                className="hover:animate-zoom-out"
                color="#ffffff"
                size={30}
              />
            </Button>
            <Button
              aria-label={t("upload_qr_image") || "Upload QR image"}
              style={{ backgroundColor: "#0d7a68" }}
              onClick={() => fileInputRef.current?.click()}
            >
              <MdOutlineQrCodeScanner color="#ffffff" size={30} />
            </Button>
            
            <Button
              className="flex items-center justify-center"
              style={{ backgroundColor: "#0d7a68" }}
              onClick={resetState}
            >
              <MdClear color="#ffffff" size={30} />
            </Button>
            <input
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              type="file"
              onChange={handleImageUpload}
            />
          </div>

          {!loading &&
            !useCamera &&
            (!entry || (Array.isArray(entry) && entry.length === 0)) && (
              <div className="flex flex-col items-center justify-center space-y-4">
                <div data-aos="zoom-in-right">
                  <img
                    alt={t("no_data_illustration") || "No data found illustration"}
                    className="max-w-xs h-auto"
                    src={`/image/fly.png`}
                  />
                </div>
                <h1 className="text-2xl font-bold text-center text-[#0d7a68]">
                  {t("no_data_found") || "No data found"}
                </h1>
              </div>
            )}

          {!loading && useCamera && (
            <div className="relative bg-white dark:bg-gray-800 px-4 pt-8 pb-4 rounded-xl shadow-md overflow-hidden">
              <button
                aria-label={t("close_camera") || "Close Camera"}
                className="absolute top-2 right-1 z-10 text-[#0d7a68] hover:text-red-500 rounded-full p-1"
                onClick={() => setUseCamera(false)}
              >
                <IoCloseOutline className="color-[#0d7a68]" size={20} />
              </button>

              <div className="relative w-full h-80 border border-gray-300 rounded-lg overflow-hidden">
                <QrReader
                  constraints={{ facingMode: "environment" }}
                  containerStyle={{ width: "100%", height: "100%" }}
                  videoStyle={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "0",
                  }}
                  onResult={(result, error) => {
                    if (result) handleQrScan(result);
                    else if (error?.message?.includes("NotAllowedError")) {
                      alert(
                        t("camera_permission_denied") ||
                          "❌ Camera permission denied.",
                      );
                      setUseCamera(false);
                    }
                  }}
                />
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                  <div className="absolute top-0 left-0 w-full h-[2px] bg-[#0d7a68] animate-scan" />
                </div>
              </div>

              <p className="mt-2 text-sm text-center text-gray-500">
                {t("scanned_result") || "Scanned Result"}:{" "}
                {scanResult || t("na") || "N/A"}
              </p>
            </div>
          )}

          {loading && <Loading />}

          {!loading && entry && Array.isArray(entry) && entry.length > 0 && (
            <div className="space-y-6">
              {entry.map((row, idx) => (
                <div
                  key={row.id || row.phone || idx}
                  className="bg-green-50 border border-green-300 p-6 rounded-2xl text-sm text-green-800 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                >
                  <h2 className="font-bold text-lg mb-2 text-[#0d7a68] dark:text-gray-200">
                    {t("matched_entry") || "Matched Entry"}{" "}
                    {entry.length > 1 ? idx + 1 : ""}
                  </h2>
                  <ul className="space-y-1">
                    {Object.entries(row).map(([key, value]) => {
                      const normalizedKeyForTranslation = key
                        .trim()
                        .toLowerCase()
                        .replace(/\s+/g, "");
                      const displayKey = t(normalizedKeyForTranslation) || key;
                      let displayValue = value && String(value).trim() !== ""
                        ? String(value)
                        : "N/A";

                      if (normalizedKeyForTranslation === "phone") {
                        displayValue = maskPhoneNumber(displayValue);
                      }

                      return (
                        <li
                          key={key}
                          className="flex justify-between border-b border-green-200 pb-1 dark:border-gray-500"
                        >
                          <span className="font-semibold">{displayKey} : </span>
                          <span>{displayValue}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </DefaultLayout>
  );
}