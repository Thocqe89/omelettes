import { useTranslation } from "react-i18next";
import { useState, useEffect, useCallback } from "react";
import {
  Button,
  Pagination,
} from "@heroui/react";
import { addToast } from "@heroui/toast";

import Loading from "@/components/loading";
import DefaultLayout from "@/layouts/default";
import i18n from "@/i18n";
import "aos/dist/aos.css";

interface Product {
  "Purchase Link": string;
  ID: string;
  Name: string;
  Type: string;
  Size: string;
  "Qty Bought": number;
  "Final Selling Price": number;
  Status: string;
  Notes: string;
}

const statusOptions = [
  { key: "all", labelKey: "all" },
  { key: "available", labelKey: "available" },
  { key: "sold_out", labelKey: "sold_out" },
  { key: "in_transit", labelKey: "in_transit" },
];

export default function ProductsPage() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentDateTime, setCurrentDateTime] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [statusFilter, setStatusFilter] = useState("all");

  // Filter products based on status
  const filteredProducts =
    statusFilter === "all"
      ? products
      : products.filter(
          (p) =>
            p.Status.toLowerCase().replace(/\s/g, "_") ===
            statusFilter.toLowerCase(),
        );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Slice the products for the current page
  const startIndex = (currentPage - 1) * itemsPerPage;
  const pageData = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  // Pad with undefined so table always shows full rows
  const paginatedProducts: (Product | undefined)[] = [...pageData];
  while (paginatedProducts.length < itemsPerPage) {
    paginatedProducts.push(undefined);
  }

  const localeMap: Record<string, string> = {
    la: "lo",
    thai: "th",
    th: "th",
    zh: "zh-CN",
    "zh-CN": "zh-CN",
    "zh-TW": "zh-TW",
  };

  const locale = localeMap[i18n.language] || i18n.language || undefined;

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();

      setCurrentDateTime(
        now.toLocaleString(locale, {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      );
    };

    updateClock();
    const timer = setInterval(updateClock, 1000);

    return () => clearInterval(timer);
  }, [locale]);

  const apiUrl = import.meta.env.VITE_PRODUCT_DETAILS_API;

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${apiUrl}?nocache=${Date.now()}`);

      if (!response.ok)
        throw new Error(`${t("error_fetching")} (HTTP ${response.status})`);

      const { success, products: fetchedProducts } = await response.json();

      if (!success || !Array.isArray(fetchedProducts))
        throw new Error(t("invalid_data"));

      setProducts(
        fetchedProducts.map((p: any) => ({
          "Purchase Link": p["Purchase Link"] || "#",
          ID: p.ID || "N/A",
          Name: p.Name || "N/A",
          Type: p.Type || "-",
          Size: p.Size || "-",
          "Qty Bought": Number(p["Qty Bought"]) || 0,
          "Final Selling Price": Number(p["Final Selling Price"]) || 0,
          Status: p["Status"] || "Available",
          Notes: p.Notes || "",
        })),
      );

      setCurrentPage(1);
      setStatusFilter("all");

      addToast({
        title: t("loaded_successfully"),
        description: t("products_have_been_loaded"),
        color: "success",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : t("unknown_error");

      setError(message);
      addToast({
        title: t("error"),
        description: message,
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  }, [apiUrl, t]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleStatusSelect = (key: string) => {
    setStatusFilter(key);
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <DefaultLayout>
        <div className="flex flex-col items-center justify-center h-screen gap-4 bg-white dark:bg-gray-900">
          <Loading />
          <p className="text-green-700 dark:text-green-300 animate-pulse">
            {t("loading_products")}
          </p>
        </div>
      </DefaultLayout>
    );
  }

  if (error) {
    return (
      <DefaultLayout>
        <div className="text-center py-10 bg-white dark:bg-gray-900">
          <div className="text-red-500 dark:text-red-400 mb-4">{error}</div>
          <Button
            className="bg-green-700 hover:bg-green-800 text-white dark:bg-green-600 dark:hover:bg-green-500"
            onClick={fetchProducts}
          >
            {t("try_again")}
          </Button>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-6 py-12 px-4 sm:px-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#0d7a68] dark:text-[#0d7a68] font-extrabold mb-3 text-center sm:text-left">
          {t("product")}
        </h1>

        <div className="w-full max-w-7xl flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
          <div className="inline-block text-gray-600 dark:text-gray-300 text-xs sm:text-sm md:text-base px-3 py-1 rounded-lg shadow dark:bg-gray-800 whitespace-nowrap">
            {currentDateTime}
          </div>

          {/* Status filter buttons */}
          <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
            {statusOptions.map(({ key, labelKey }) => {
              const isActive = statusFilter === key;
              return (
                <Button
                  key={key}
                  size="sm"
                  // variant={isActive ? "filled" : "outlined"}
                  className={`capitalize ${
                    isActive ? "bg-[#0d7a68] text-white dark:bg-[#0a5a47]" : ""
                  }`}
                  onClick={() => handleStatusSelect(key)}
                  aria-pressed={isActive}
                >
                  {t(labelKey)}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="w-full max-w-7xl overflow-x-auto rounded-lg shadow-md">
          <table className="w-full bg-white dark:bg-gray-800 border-collapse min-w-[600px] sm:min-w-full">
            <thead className="bg-green-50 border border-green-300 p-4 text-xs sm:text-sm text-green-800 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 sticky top-0 z-10">
              <tr>
                <th className="p-2 sm:p-3 text-left whitespace-nowrap">No</th>
                <th className="p-2 sm:p-3 text-left min-w-[100px]">{t("name")}</th>
                <th className="p-2 sm:p-3 text-left min-w-[80px]">{t("type")}</th>
                <th className="p-2 sm:p-3 text-left min-w-[60px]">{t("size")}</th>
                <th className="p-2 sm:p-3 text-center whitespace-nowrap">{t("quantity")}</th>
                <th className="p-2 sm:p-3 text-right whitespace-nowrap">{t("price")}</th>
                <th className="p-2 sm:p-3 text-center whitespace-nowrap">{t("status")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-xs sm:text-sm">
              {paginatedProducts.map((product, index) =>
                product ? (
                  <tr
                    key={product.ID}
                    className="transition-colors hover:bg-green-50 dark:hover:bg-gray-700"
                  >
                    <td className="p-1 sm:p-3 font-mono whitespace-nowrap">{product.ID}</td>
                    <td className="p-1 sm:p-3 font-medium">{product.Name}</td>
                    <td className="p-1 sm:p-3">{product.Type}</td>
                    <td className="p-1 sm:p-3">{product.Size}</td>
                  <td className="p-2 sm:p-3 text-center text-[#0d7a68] font-bold whitespace-nowrap">
  {product["Qty Bought"]}
</td>
                    <td className="p-1 sm:p-3 text-right font-medium whitespace-nowrap">
                      {product["Final Selling Price"].toLocaleString(undefined, {
                        style: "currency",
                        currency: "LAK",
                      })}
                    </td>
                    <td className="p-1 sm:p-3 text-center whitespace-nowrap">
                      <span
                        className={`inline-block px-2 sm:px-3 py-0.5 rounded-full text-xs sm:text-sm font-bold ${
                          product.Status === "Sold Out"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            : product.Status === "In Transit"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        }`}
                      >
                        {t(product.Status.toLowerCase().replace(/\s/g, "_"))}
                      </span>
                    </td>
                  </tr>
                ) : (
                  <tr key={`empty-${index}`}>
                    <td colSpan={7} className="p-3 h-10" />
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 w-full max-w-7xl flex justify-center">
          <Pagination
            color="success"
            page={currentPage}
            size="sm"
            total={totalPages}
            onChange={setCurrentPage}
          />
        </div>

        <div className="mt-8 w-80 mx-auto" data-aos="zoom-in">
          <div className="h-1 w-full bg-[#0d7a68]" />
        </div>
      </section>
    </DefaultLayout>
  );
}
