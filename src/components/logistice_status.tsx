import * as React from "react";
import DefaultLayout from "@/layouts/default";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

const WEB_APP_POST_URL =
  "https://script.google.com/macros/s/AKfycbxK6TxvDKhMbYhK-vZyZH9s8PZrmMg5k9ETVQue0DzlRhg0eu6tEA-QvmIJzaHiOn46Ig/exec";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation example
    if (!form.productId || !form.productName) {
      alert(t("please_fill_required_fields") || "Please fill in Product ID and Product Name.");
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

        <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
          <div>
            <label className="block mb-1 font-semibold" htmlFor="productId">
              {t("product_id") || "Product ID"} *
            </label>
            <input
              type="text"
              id="productId"
              name="productId"
              value={form.productId}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md border-green-400 focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="e.g. P12345"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold" htmlFor="productName">
              {t("product_name") || "Product Name"} *
            </label>
            <input
              type="text"
              id="productName"
              name="productName"
              value={form.productName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-md border-green-400 focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="e.g. Airplane Model X"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold" htmlFor="category">
              {t("category") || "Category"}
            </label>
            <input
              type="text"
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md border-green-400 focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="e.g. Toys"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold" htmlFor="description">
              {t("description") || "Description"}
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 border rounded-md border-green-400 focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="Detailed product description"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-semibold" htmlFor="costPrice">
                {t("cost_price") || "Cost Price"}
              </label>
              <input
                type="number"
                step="0.01"
                id="costPrice"
                name="costPrice"
                value={form.costPrice}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md border-green-400 focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="e.g. 100.00"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold" htmlFor="sellingPrice">
                {t("selling_price") || "Selling Price"}
              </label>
              <input
                type="number"
                step="0.01"
                id="sellingPrice"
                name="sellingPrice"
                value={form.sellingPrice}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md border-green-400 focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="e.g. 150.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-semibold" htmlFor="stockQuantity">
                {t("stock_quantity") || "Stock Quantity"}
              </label>
              <input
                type="number"
                id="stockQuantity"
                name="stockQuantity"
                value={form.stockQuantity}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md border-green-400 focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="e.g. 50"
              />
            </div>

            <div>
              <label className="block mb-1 font-semibold" htmlFor="supplier">
                {t("supplier") || "Supplier"}
              </label>
              <input
                type="text"
                id="supplier"
                name="supplier"
                value={form.supplier}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md border-green-400 focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Supplier name"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-semibold" htmlFor="dateAdded">
              {t("date_added") || "Date Added"}
            </label>
            <input
              type="date"
              id="dateAdded"
              name="dateAdded"
              value={form.dateAdded}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md border-green-400 focus:outline-none focus:ring-2 focus:ring-green-600"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold" htmlFor="imageUrl">
              {t("image_url") || "Image URL"}
            </label>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md border-green-400 focus:outline-none focus:ring-2 focus:ring-green-600"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition disabled:opacity-50"
          >
            {loading ? (t("saving") || "Saving...") : (t("save_product") || "Save Product")}
          </button>
        </form>
      </section>
    </DefaultLayout>
  );
}
