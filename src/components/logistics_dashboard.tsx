import * as React from "react";
import { useTranslation } from "react-i18next";
import { FaWhatsapp } from "react-icons/fa";
import dayjs from "dayjs";

import Loading from "@/components/loading";
import DefaultLayout from "@/layouts/default";
import "aos/dist/aos.css";

const WEB_APP_POST_URL = import.meta.env.VITE_GOOGLE_SHEET_URL;

export default function Logistics_dashboard() {
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
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const filteredEntries = entries.filter((entry) =>
    Object.values(entry).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  );

  return (
    <DefaultLayout>
      {loading ? (
        <Loading />
      ) : (
        <section className="min-h-screen py-10 px-4 bg-gray-50 dark:bg-gray-900">
          <div className="w-full max-w-4xl mx-auto space-y-6">
            <h1
              className="text-3xl font-bold text-center "
              style={{ color: "#0d7a68" }}
            >
              {t("submitted_data")}
            </h1>

            <input
              className="w-full p-2 rounded-md border border-[#0d7a68] focus:outline-none focus:ring-2 focus:ring-green-800"
              placeholder={t("search") || "Search..."}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {filteredEntries.length === 0 && (
              <p className="text-center text-red-500 font-medium">
                {t("no_results_found") || "No results found"}
              </p>
            )}

            <div className="space-y-6">
              {filteredEntries.map((entry, index) => {
                const phoneKey = Object.keys(entry).find(
                  (key) => key.toLowerCase() === "phone",
                );
                const phone = phoneKey ? String(entry[phoneKey]) : null;

                return (
                  <div key={index} data-aos="zoom-in-up">
                    <div className="bg-green-50 border border-green-300 p-6 rounded-2xl text-sm text-green-800 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
                      <div className="space-y-2">
                        {Object.entries(entry).map(([key, value]) => {
                          const lowerKey = key.trim().toLowerCase();
                          const isDateField = lowerKey.includes("date"); // Adjust if needed

                          return (
                            <li
                              key={key.trim()}
                              className="flex justify-between items-start border-b border-green-200 pb-1"
                            >
                              <span className="font-semibold">
                                {t(lowerKey.replace(/ /g, ""))}:
                              </span>

                              <span className="text-right break-words max-w-[60%]">
                                {isDateField
                                  ? dayjs(String(value)).format(
                                      "YYYY-MM-DD HH:mm:ss",
                                    )
                                  : String(value)}
                              </span>
                            </li>
                          );
                        })}
                      </div>

                      {/* WhatsApp Button */}
                      {phone && (
                        <div className="flex justify-end mt-4">
                          <span />

                          <a
                            className="inline-flex items-center gap-2 bg-green-600 text-white font-medium py-2 px-4 rounded hover:bg-green-700 transition"
                            href={`https://wa.me/${phone.replace(/\D/g, "")}`}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            <FaWhatsapp size={20} />
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </DefaultLayout>
  );
}
