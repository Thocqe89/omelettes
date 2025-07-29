import * as React from "react";
import { useTranslation } from "react-i18next";
import { useState, useRef } from "react"; // Added useEffect for better theme handling
import { QrReader } from "react-qr-reader";
import jsQR from "jsqr";
import { RiQrScan2Line } from "react-icons/ri";
import { Button } from "@heroui/button";
import { MdOutlineQrCodeScanner } from "react-icons/md";
import { AiOutlineSearch } from "react-icons/ai";
import { IoCloseOutline } from "react-icons/io5";

import Loading from "@/components/loading";
import DefaultLayout from "@/layouts/default";

// Define the structure of your data entry for better type safety
interface EntryData {
  id?: string;
  phone?: string;
  [key: string]: string | undefined; // Allows for dynamic or additional string keys
}


const WEB_APP_POST_URL = import.meta.env.VITE_GOOGLE_SHEET_URL;


/**
 * DataCheck is a component that allows users to scan a QR code or search for entries by phone number.
 * It fetches data from a Google Apps Script endpoint and displays the results in a list.
 * If no data is found, it displays an empty state with an illustration.
 * If the user has granted camera permission, it displays a camera view with a green scan line animation.
 * If the user has not granted camera permission, it displays a message asking for permission.
 * When the user scans a QR code or searches by phone number, it fetches the data and displays the results.
 * If the fetch fails, it displays an error message.
 * If the user clears the search input, it resets the state to the initial empty state.
 * If the user uploads an image, it processes the image and fetches the data if a QR code is found.
 * If the user clicks the close button while the camera is open, it resets the state to the initial empty state.
 */
export default function DataCheck() {
  const { t } = useTranslation();
  const [scanResult, setScanResult] = useState<string>("");
  const [entry, setEntry] = useState<EntryData[] | null>(null); // Changed to EntryData[]
  const [loading, setLoading] = useState(false);
  const [useCamera, setUseCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [phoneSearch, setPhoneSearch] = useState<string>("");
  // const [theme, setTheme] = useState<'light' | 'dark'>('light'); // Manage theme with state

  // // Detect theme on mount and subscribe to changes
  // useEffect(() => {
  //     const detectTheme = () => {
  //         const currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  //         setTheme(currentTheme);
  //     };

  //     detectTheme(); // Set theme initially
  //     window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', detectTheme); // Listen for changes

  //     return () => {
  //         window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', detectTheme); // Cleanup
  //     };
  // }, []);

  const normalizeKey = (key: string) => key.trim().toLowerCase();

  const fetchEntry = async (
    searchValue: string,
    keyToMatch: "id" | "phone",
  ) => {
    if (!searchValue) return;
    setLoading(true);
    setEntry(null); // Clear previous results immediately
    setUseCamera(false); // Hide camera if it was open when fetching

    try {
      const res = await fetch(WEB_APP_POST_URL);
      
      const data: any[] = await res.json(); // Explicitly type as any[] if structure is not strict

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
          .includes(searchValue.trim()); // Allow partial match
      });

      setEntry(matchedEntries.length > 0 ? matchedEntries : []); // Set to empty array if no matches
      setScanResult(searchValue);
    } catch (err) {
      console.error("Fetch error:", err);
      alert(
        t("fetch_error_message") || "An error occurred while fetching data.",
      ); // User-friendly error
      setEntry([]); // Set to empty array on error to show "no data" message
    } finally {
      setLoading(false);
    }
    
  };

  const resetState = () => {
    setScanResult("");
    setPhoneSearch("");
    setEntry(null); // Set to null for initial empty state
    setUseCamera(false);
  };

  const handleQrScan = (result: any) => {
    if (result?.getText) {
      const id = result.getText();

      setScanResult(id);
      fetchEntry(id, "id");
      // setUseCamera(false); // This is already handled by fetchEntry
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setEntry(null); // Clear previous results when uploading new image
    setLoading(true); // Show loading while processing image

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
        setEntry([]); // Show no data found message
      }

      URL.revokeObjectURL(objectUrl);
    };
    img.onerror = () => {
      alert(t("failed_to_load_image") || "⚠️ Failed to load image.");
      URL.revokeObjectURL(objectUrl);
      setLoading(false);
      setEntry([]); // Show no data found message
    };
  };

  return (
    <DefaultLayout>
      <section className="min-h-screen px-4 py-10 ">
        <div className="max-w-xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold text-center text-[#0d7a68]">
            {t("order_details") || "Scan QR Code"}
          </h1>
          {/* Removed empty p tag */}

          {/* Search by Phone Number */}
          <div className="flex gap-2">
            <div className="relative w-full">
              <input
                className="w-full p-2 pr-10 rounded-md border focus:outline-none focus:ring-2 focus:ring-green-800"
                placeholder={t("enter_phone_number") || "Enter phone number"}
                style={{ borderColor: "#0d7a68" }}
                type="text"
                value={phoneSearch}
                onChange={(e) => setPhoneSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    fetchEntry(phoneSearch, "phone");
                  }
                }}
              />
              <button
                aria-label={t("search_phone") || "Search phone number"}
                className="absolute right-2 top-1/2 -translate-y-1/2"
                style={{ padding: "4px", borderRadius: "4px" }}
                onClick={() => fetchEntry(phoneSearch, "phone")}
              >
                <AiOutlineSearch size={24} style={{ color: "#0d7a68" }} />
              </button>
            </div>

            <Button
              className="flex items-center justify-center"
              style={{ backgroundColor: "#0d7a68" }}
              onClick={resetState}
            >
              <h1 className="text-white">{t("clear") || "Clear"}</h1>
            </Button>
          </div>

          {/* Camera & Upload Buttons */}
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
            <input
              ref={fileInputRef}
              accept="image/*"
              className="hidden"
              type="file"
              onChange={handleImageUpload}
            />
          </div>

          {/* Display Image for Empty State / No Data Found */}
          {/* THIS IS THE KEY CHANGE: Hide when loading or camera is active */}
          {!loading &&
            !useCamera &&
            (!entry || (Array.isArray(entry) && entry.length === 0)) && (
              <div className="flex flex-col items-center justify-center space-y-4">
                <div data-aos="zoom-in-right">
                  <img
                    alt={
                      t("no_data_illustration") || "No data found illustration"
                    }
                    className="max-w-xs h-auto" // Added h-auto for responsiveness
                    src={`/image/fly.png`} // Simplified as it's always '1v.png'
                  />
                </div>
                <h1 className="text-2xl font-bold text-center text-[#0d7a68]">
                  {t("no_data_found") || "No data found"}
                </h1>
              </div>
            )}

          {!loading && useCamera && (
            <div className="relative bg-white dark:bg-gray-800 px-4 pt-8 pb-4 rounded-xl shadow-md overflow-hidden">
              {/* Close button */}
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
                {/* Animated green scan line */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                  {/* Using inline style here to match existing code, but Tailwind custom color preferred */}
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
                  key={row.id || row.phone || idx} // Prioritize unique ID, fallback to index
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
                      const displayValue =
                        value && String(value).trim() !== ""
                          ? String(value)
                          : "N/A";

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
