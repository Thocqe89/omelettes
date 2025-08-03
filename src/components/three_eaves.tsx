import * as React from "react";
import { useTranslation } from "react-i18next";
import { FaWhatsapp } from "react-icons/fa";
import dayjs from "dayjs";
import { Image } from "@heroui/image";
import Loading from "@/components/loading";
import DefaultLayout from "@/layouts/default";
import "aos/dist/aos.css";

const WEB_APP_POST_URL = import.meta.env.VITE_GOOGLE_SHEET_URL;

export default function Three_eaves() {
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
          <div className="bg-green-700 text-white py-10 px-4 text-center">
            <Image
              src="/image/menu/tl1.png"
              alt="Logo"
              width={100}
              height={100}
              className="mx-auto justify-end"
            />
            <h1 className="text-4xl font-bold tracking-wide">Three Leaves</h1>
            <p className="mt-2 text-lg opacity-90">
              {t("taste_of_nature") || "Natural • Fresh • Delicious"}
            </p>
          </div>

          <div className="max-w-7xl mx-auto py-10 px-4 space-y-8">
            {/* Search Bar */}
            <div className="flex justify-center">
              <input
                className="w-full max-w-lg px-5 py-3 rounded-full border border-green-400 focus:outline-none focus:ring-2 focus:ring-green-700 dark:bg-gray-800 dark:border-green-600 dark:text-white"
                placeholder={t("search") || "Search for dishes..."}
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
                  const imageUrl = imageKey ? String(entry[imageKey]) : "/image/three_leaves_df.png";

                  const nameKey = Object.keys(entry).find((key) =>
                    key.toLowerCase().includes("name")
                  );
                  const foodName = nameKey ? String(entry[nameKey]) : t("no_name");

                  const priceKey = Object.keys(entry).find((key) =>
                    key.toLowerCase().includes("price")
                  );
                  const price = priceKey ? String(entry[priceKey]) : null;

                  return (
                    <div
                      key={index}
                      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden flex flex-col"
                      data-aos="fade-up"
                    >
                      {/* Food Image */}
                      <img
                        src={imageUrl}
                        alt={foodName}
                        className="h-48 w-full object-cover"
                      />

                      {/* Content */}
                      <div className="flex flex-col flex-1 p-5">
                        <h3 className="text-lg font-bold text-green-700 dark:text-green-400">
                          {foodName}
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
                            if (lowerKey.includes("image") || lowerKey.includes("name") || lowerKey.includes("price")) {
                              return null;
                            }
                            const isDateField = lowerKey.includes("date");
                            return (
                              <li key={key} className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-1">
                                <span className="font-medium capitalize">{t(lowerKey.replace(/_/g, " "))}:</span>
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
                            className="mt-4 inline-flex items-center justify-center gap-2 bg-green-600 text-white font-medium py-2 px-4 rounded-full hover:bg-green-700 transition"
                            href={`https://wa.me/${phone.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <FaWhatsapp size={20} />
                            {t("order_now") || "Order Now"}
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
