import { useTranslation } from "react-i18next";
import DefaultLayout from "@/layouts/default";
import { useState, useEffect, useCallback } from "react";
import Loading from "@/components/loading";
import { Button } from "@heroui/react";
import { addToast } from "@heroui/toast";
import {
 
  useDisclosure,
} from "@heroui/react";

interface Product {
  purchaseLink: string;
  id: string;
  name: string;
  type: string;
  size: string;
  priceYuan: number;
  exchangeRate: number;
  priceLak: number;
  quantity: number;
  chinaShipping: number;
  localShipping: number;
  totalCost: number;
  unitCost: number;
  sellingPrice: number;
  profit: number;
  finalSellingPrice: number;
  soldOut?: boolean;
  notes?: string;
}

export default function ProductsPage() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const apiUrl = import.meta.env.VITE_PRODUCT_DETAILS_API;

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [newProduct, setNewProduct] = useState({
    id: "",
    name: "",
    type: "",
    size: "",
    priceYuan: "",
    priceLak: "",
    quantity: "",
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      const productsData = data.slice(1).map((row: any[]) => {
        if (!row || row.length < 18) return null;
        return {
          purchaseLink: row[0] || "",
          id: row[1] || "N/A",
          name: row[2] || "N/A",
          type: row[3] || "",
          size: row[4] || "",
          priceYuan: Number(row[5]) || 0,
          exchangeRate: Number(row[6]) || 0,
          priceLak: Number(row[7]) || 0,
          quantity: Number(row[8]) || 0,
          chinaShipping: Number(row[9]) || 0,
          localShipping: Number(row[10]) || 0,
          totalCost: Number(row[11]) || 0,
          unitCost: Number(row[12]) || 0,
          sellingPrice: Number(row[13]) || 0,
          profit: Number(row[14]) || 0,
          finalSellingPrice: Number(row[15]) || 0,
          soldOut: Boolean(row[16]),
          notes: row[17] || "",
        };
      }).filter(Boolean);

      setProducts(productsData as Product[]);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(t("error_fetching_products") || "Failed to load products");
      addToast({
        title: t("danger"),
        description: t("error_fetching_products") || "Failed to load products",
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  }, [apiUrl, t]);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshKey]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  }

  async function handleAddProduct() {
    if (!newProduct.id.trim() || !newProduct.name.trim()) {
      addToast({
        title: t("error"),
        description: t("product_id_name_required") || "Product ID and Name are required",
        color: "danger",
      });
      return;
    }

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: newProduct.id.trim(),
          name: newProduct.name.trim(),
          type: newProduct.type.trim(),
          size: newProduct.size.trim(),
          priceYuan: Number(newProduct.priceYuan) || 0,
          priceLak: Number(newProduct.priceLak) || 0,
          quantity: Number(newProduct.quantity) || 0,
        }),
      });

      if (!response.ok) throw new Error("Failed to add product");

      addToast({
        title: t("success"),
        description: t("product_added") || "Product added successfully",
        color: "success",
      });

      setNewProduct({
        id: "",
        name: "",
        type: "",
        size: "",
        priceYuan: "",
        priceLak: "",
        quantity: "",
      });
      onOpenChange();
      setRefreshKey((k) => k + 1);
    } catch (err) {
      console.error("Add product failed:", err);
      addToast({
        title: t("error"),
        description: t("failed_to_add_product") || "Failed to add product",
        color: "danger",
      });
    }
  }

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
    addToast({
      title: t("refreshed"),
      description: t("data_refreshed") || "Data refreshed",
      color: "success",
    });
  };

  if (loading) {
    return (
      <DefaultLayout>
        <div className="flex justify-center items-center h-screen">
          <Loading />
        </div>
      </DefaultLayout>
    );
  }

  if (error) {
    return (
      <DefaultLayout>
        <div className="text-center py-10">
          <div className="text-red-500 mb-4">{error}</div>
          <Button className="bg-[#0d7a68] text-white" onClick={handleRefresh}>
            {t("retry") || "Try Again"}
          </Button>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-8 py-12">
        <div className="w-full max-w-7xl px-4 overflow-x-auto">
          <h1 className="text-3xl font-bold text-center text-[#0d7a68] mb-6">{t("product")}</h1>
          <table className="min-w-full bg-white border border-gray-200 text-sm">
            <thead   className="bg-green-50 border border-green-300 p-6 rounded-2xl text-sm text-green-800 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
              <tr>
                <th className="py-2 px-3">{t("purchase_link")}</th>
                <th className="py-2 px-3">{t("product_id")}</th>
                <th className="py-2 px-3">{t("name")}</th>
                <th className="py-2 px-3">{t("type")}</th>
                <th className="py-2 px-3">{t("size")}</th>
                <th className="py-2 px-3">{t("price_¥")}</th>
                <th className="py-2 px-3">{t("exchange_rate")}</th>
                <th className="py-2 px-3">{t("price_lak")}</th>
                <th className="py-2 px-3">{t("quantity")}</th>
                <th className="py-2 px-3">{t("shipping_china")}</th>
                <th className="py-2 px-3">{t("local_shipping")}</th>
                <th className="py-2 px-3">{t("total_cost")}</th>
                <th className="py-2 px-3">{t("unit_cost")}</th>
                <th className="py-2 px-3">{t("selling_price")}</th>
                <th className="py-2 px-3">{t("profit")}</th>
                <th className="py-2 px-3">{t("final_selling_price")}</th>
                <th className="py-2 px-3">{t("status")}</th>
                <th className="py-2 px-3">{t("notes")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-700">
              {products.map((p) => (
                <tr key={p.id} className={p.soldOut ? "opacity-60" : ""}>
                  <td className="py-2 px-3">
                    <a
                      href={p.purchaseLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0d7a68] underline"
                    >
                      Link
                    </a>
                  </td>
                  <td className="py-2 px-3">{p.id}</td>
                  <td className="py-2 px-3">{p.name}</td>
                  <td className="py-2 px-3">{p.type}</td>
                  <td className="py-2 px-3">{p.size}</td>
                  <td className="py-2 px-3 text-right">{p.priceYuan.toLocaleString()} ¥</td>
                  <td className="py-2 px-3 text-right">{p.exchangeRate}</td>
                  <td className="py-2 px-3 text-right">{p.priceLak.toLocaleString()} </td>
                  <td className="py-2 px-3 text-right">{p.quantity}</td>
                  <td className="py-2 px-3 text-right">{p.chinaShipping.toLocaleString()} </td>
                  <td className="py-2 px-3 text-right">{p.localShipping.toLocaleString()} </td>
                  <td className="py-2 px-3 text-right">{p.totalCost.toLocaleString()} </td>
                  <td className="py-2 px-3 text-right">{p.unitCost.toLocaleString()} </td>
                  <td className="py-2 px-3 text-right">{p.sellingPrice.toLocaleString()} </td>
                  <td className={`py-2 px-3 text-right ${p.profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {p.profit.toLocaleString()}
                  </td>
                  <td className="py-2 px-3 text-right">{p.finalSellingPrice.toLocaleString()} </td>
                  <td className="py-2 px-3 text-center">
                    {p.soldOut ? (
                      <span className="text-red-600">{t("sold_out")}</span>
                    ) : (
                      <span className="text-green-600">{t("available")}</span>
                    )}
                  </td>
                  <td className="py-2 px-3">{p.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex flex-wrap gap-4 mt-6 justify-center">
            <Button className="bg-[#0d7a68] text-white" onClick={handleRefresh} disabled={loading}>
              {t("refresh_data") || "Refresh Data"}
            </Button>
            <Button className="border-[#0d7a68] text-[#0d7a68]" onClick={onOpen}>
              {t("add_new_product") || "Add New Product"}
            </Button>
          </div>
        </div>

        {/* Modal not expanded in this snippet */}
      </section>
    </DefaultLayout>
  );
}
