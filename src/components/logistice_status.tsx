import * as React from "react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

import DefaultLayout from "@/layouts/default";

const WEB_APP_POST_URL = import.meta.env.VITE_GOOGLE_SHEET_URL;



export default function ProductInputForm() {
  const { t } = useTranslation();

  const [form, setForm] = React.useState({
    productId: "",
    productName: "",
    category: "",
    description: "",
    costPrice: "",
    sellingPrice: "",
    stockQuantity: "",
    supplier: "",
    dateAdded: dayjs().format("YYYY-MM-DD"),
    imageUrl: "",
  });

  const [loading, setLoading] = React.useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation example
    if (!form.productId || !form.productName) {
      alert(
        t("please_fill_required_fields") ||
          "Please fill in Product ID and Product Name.",
      );

      return;
    }

    setLoading(true);

    try {
      const response = await fetch(WEB_APP_POST_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: form.productId,
          productName: form.productName,
          category: form.category,
          description: form.description,
          costPrice: form.costPrice,
          sellingPrice: form.sellingPrice,
          stockQuantity: form.stockQuantity,
          supplier: form.supplier,
          dateAdded: form.dateAdded,
          imageUrl: form.imageUrl,
        }),
      });

      await response.json();

      alert(t("product_added_successfully") || "Product added successfully!");
      setForm({
        productId: "",
        productName: "",
        category: "",
        description: "",
        costPrice: "",
        sellingPrice: "",
        stockQuantity: "",
        supplier: "",
        dateAdded: dayjs().format("YYYY-MM-DD"),
        imageUrl: "",
      });
    } catch (error) {
      console.error(error);
      alert(t("error_adding_product") || "Error adding product.");
    }

    setLoading(false);
  };

  return (
    <DefaultLayout>
      <section className="min-h-screen py-10 px-6 bg-gray-50 dark:bg-gray-900 max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-green-800 mb-8">
          {t("add_new_product") || "Add New Product"}
        </h1>

        <form
          className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md"
          onSubmit={handleSubmit}
        >
          <div>
            <label className="block mb-1 font-semibold" htmlFor="productId">
              {t("product_id") || "Product ID"} *
            </label>
            <input
              required
              className="w-full px-3 py-2 border rounded-md border-green-400 focus:outline-none focus:ring-2 focus:ring-green-600"
              id="productId"
              name="productId"
              placeholder="e.g. P12345"
              type="text"
              value={form.productId}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold" htmlFor="productName">
              {t("product_name") || "Product Name"} *
            </label>
            <input
              required
              className="w-full px-3 py-2 border rounded-md border-green-400 focus:outline-none focus:ring-2 focus:ring-green-600"
              id="productName"
              name="productName"
              placeholder="e.g. Airplane Model X"
              type="text"
              value={form.productName}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold" htmlFor="category">
              {t("category") || "Category"}
            </label>
            <input
              className="w-full px-3 py-2 border rounded-md border-green-400 focus:outline-none focus:ring-2 focus:ring-green-600"
              id="category"
              name="category"
              placeholder="e.g. Toys"
              type="text"
              value={form.category}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold" htmlFor="description">
              {t("description") || "Description"}
            </label>
            <textarea
              className="w-full px-3 py-2 border rounded-md border-green-400 focus:outline-none focus:ring-2 focus:ring-green-600"
              id="description"
              name="description"
              placeholder="Detailed product description"
              rows={3}
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-semibold" htmlFor="costPrice">
                {t("cost_price") || "Cost Price"}
              </label>
              <input
                className="w-full px-3 py-2 border rounded-md border-green-400 focus:outline-none focus:ring-2 focus:ring-green-600"
                id="costPrice"
                name="costPrice"
                placeholder="e.g. 100.00"
                step="0.01"
                type="number"
                value={form.costPrice}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                className="block mb-1 font-semibold"
                htmlFor="sellingPrice"
              >
                {t("selling_price") || "Selling Price"}
              </label>
              <input
                className="w-full px-3 py-2 border rounded-md border-green-400 focus:outline-none focus:ring-2 focus:ring-green-600"
                id="sellingPrice"
                name="sellingPrice"
                placeholder="e.g. 150.00"
                step="0.01"
                type="number"
                value={form.sellingPrice}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className="block mb-1 font-semibold"
                htmlFor="stockQuantity"
              >
                {t("stock_quantity") || "Stock Quantity"}
              </label>
              <input
                className="w-full px-3 py-2 border rounded-md border-green-400 focus:outline-none focus:ring-2 focus:ring-green-600"
                id="stockQuantity"
                name="stockQuantity"
                placeholder="e.g. 50"
                type="number"
                value={form.stockQuantity}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold" htmlFor="supplier">
                {t("supplier") || "Supplier"}
              </label>
              <input
                className="w-full px-3 py-2 border rounded-md border-green-400 focus:outline-none focus:ring-2 focus:ring-green-600"
                id="supplier"
                name="supplier"
                placeholder="Supplier name"
                type="text"
                value={form.supplier}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-semibold" htmlFor="dateAdded">
              {t("date_added") || "Date Added"}
            </label>
            <input
              className="w-full px-3 py-2 border rounded-md border-green-400 focus:outline-none focus:ring-2 focus:ring-green-600"
              id="dateAdded"
              name="dateAdded"
              type="date"
              value={form.dateAdded}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold" htmlFor="imageUrl">
              {t("image_url") || "Image URL"}
            </label>
            <input
              className="w-full px-3 py-2 border rounded-md border-green-400 focus:outline-none focus:ring-2 focus:ring-green-600"
              id="imageUrl"
              name="imageUrl"
              placeholder="https://example.com/image.jpg"
              type="url"
              value={form.imageUrl}
              onChange={handleChange}
            />
          </div>

          <button
            className="w-full py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50"
            disabled={loading}
            type="submit"
          >
            {loading
              ? t("saving") || "Saving..."
              : t("save_product") || "Save Product"}
          </button>
        </form>
      </section>
    </DefaultLayout>
  );
}
