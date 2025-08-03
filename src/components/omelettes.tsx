import * as React from "react";
import { useTranslation } from "react-i18next";
import { FaWhatsapp, FaPlane } from "react-icons/fa";
import dayjs from "dayjs";

import Loading from "@/components/loading";
import DefaultLayout from "@/layouts/default";
import "aos/dist/aos.css";

const WEB_APP_POST_URL = import.meta.env.VITE_GOOGLE_SHEET_URL;

export default function Omellets() {
  const { t } = useTranslation();
  const [entries, setEntries] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchTerm, setSearchTerm] = React.useState("");

  React.useEffect(() => {
    fetch(WEB_APP_POST_URL)
      .then((res) => res.json())
      .then((data) => {
        setEntries(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

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
          {/* Hero Section */}
          <div className="bg-gradient-to-r from-sky-600 to-blue-500 text-white py-12 px-4 text-center shadow-md">
            <h1 className="text-5xl font-extrabold tracking-wide drop-shadow-md">
              {t("omellets") || "Omellet’s Airplane Models"}
            </h1>
            <p className="mt-3 text-lg opacity-95">
              {t("premium_model_aircraft") || "Premium Model Aircraft • Collectors & Enthusiasts"}
            </p>
          </div>

          <div className="max-w-7xl mx-auto py-10 px-4 space-y-8">
            {/* Search Bar */}
            <div className="flex justify-center">
              <input
                className="w-full max-w-lg px-5 py-3 rounded-full border border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-600 dark:bg-gray-800 dark:border-sky-500 dark:text-white shadow-sm"
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
                {filteredEntries.map((entry, index) => {
                  const phoneKey = Object.keys(entry).find(
                    (key) => key.toLowerCase() === "phone"
                  );
                  const phone = phoneKey ? String(entry[phoneKey]) : null;

                  const imageKey = Object.keys(entry).find((key) =>
                    key.toLowerCase().includes("image")
                  );
                  const imageUrl =
                    imageKey && entry[imageKey] && String(entry[imageKey]).trim() !== ""
                      ? String(entry[imageKey])
                      : "/image/fly.png";

                  const nameKey = Object.keys(entry).find((key) =>
                    key.toLowerCase().includes("name")
                  );
                  const modelName = nameKey ? String(entry[nameKey]) : t("no_name");

                  const priceKey = Object.keys(entry).find((key) =>
                    key.toLowerCase().includes("price")
                  );
                  const price = priceKey ? String(entry[priceKey]) : null;

                  return (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-shadow"
                      data-aos="fade-up"
                    >
                      {/* Model Image */}
                      <img
                        src={imageUrl}
                        alt={modelName}
                        className="h-48 w-full object-contain bg-gray-100 dark:bg-gray-700 p-4"
                      />

                      {/* Content */}
                      <div className="flex flex-col flex-1 p-5">
                        <h3 className="text-xl font-bold text-sky-600 dark:text-sky-400 flex items-center gap-2">
                          <FaPlane className="text-sky-500" />
                          {modelName}
                        </h3>
                        {price && (
                          <p className="text-green-600 dark:text-green-300 font-semibold mt-1">
                            {price} ₭
                          </p>
                        )}

                        {/* Details */}
                        <ul className="mt-3 text-sm text-gray-700 dark:text-gray-300 space-y-1">
                          {Object.entries(entry).map(([key, value]) => {
                            const lowerKey = key.trim().toLowerCase();
                            if (
                              lowerKey.includes("image") ||
                              lowerKey.includes("name") ||
                              lowerKey.includes("price")
                            ) {
                              return null;
                            }
                            const isDateField = lowerKey.includes("date");
                            return (
                              <li
                                key={key}
                                className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-1"
                              >
                                <span className="font-medium capitalize">
                                  {t(lowerKey.replace(/_/g, " "))}
                                </span>
                                <span>
                                  {isDateField
                                    ? dayjs(String(value)).format("YYYY-MM-DD HH:mm")
                                    : String(value)}
                                </span>
                              </li>
                            );
                          })}
                        </ul>

                        {/* WhatsApp Button */}
                        {phone && (
                          <a
                            className="mt-5 inline-flex items-center justify-center gap-2 bg-green-600 text-white font-medium py-2 px-5 rounded-full hover:bg-green-700 transition-all shadow-md"
                            href={`https://wa.me/${phone.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FaWhatsapp size={20} />
                            <span className="hidden sm:inline">{t("order_now") || "Order Now"}</span>
                          </a>
                        )}
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
