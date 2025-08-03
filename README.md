# Vite & HeroUI Template

This is a template for creating applications using Vite and HeroUI (v2).

[Try it on CodeSandbox](https://githubbox.com/frontio-ai/vite-template)

## Technologies Used

- [Vite](https://vitejs.dev/guide/)
- [HeroUI](https://heroui.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Tailwind Variants](https://tailwind-variants.org)
- [TypeScript](https://www.typescriptlang.org)
- [Framer Motion](https://www.framer.com/motion)

## How to Use

To clone the project, run the following command:

```bash
git clone https://github.com/frontio-ai/vite-template.git
```

### Install dependencies

You can use one of them `npm`, `yarn`, `pnpm`, `bun`, Example using `npm`:

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

### Setup pnpm (optional)

If you are using `pnpm`, you need to add the following code to your `.npmrc` file:

```bash
public-hoist-pattern[]=*@heroui/*
```

After modifying the `.npmrc` file, you need to run `pnpm install` again to ensure that the dependencies are installed correctly.

## License

Licensed under the [MIT license](https://github.com/frontio-ai/vite-template/blob/main/LICENSE).


npm run build


netlify deploy --prod


import { useState } from "react";
import { motion } from "framer-motion";
import { Image } from "@heroui/image"; // If using HeroUI

export default function Loading() {
  const [loaded, setLoaded] = useState(false);
import { useState } from "react";
import { motion } from "framer-motion";
import { Image } from "@heroui/image";

export default function Loading() {
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center h-screen "
    >
      <div className="relative w-60 h-60 flex items-center justify-center">
        {/* Circular spinning border */}
        <motion.div
          className="absolute w-full h-full rounded-full border-4 border-green-500 border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 2,
            ease: "linear",
          }}
        />

        {/* Zooming logo inside */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
          }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "easeInOut",
          }}
          className="z-10"
        >
          {!loaded && <span className="text-gray-500">Loading...</span>}
          <Image
            isBlurred
            alt="Omelette's Logo"
            src="/image/logo-r-g1.png"
            width={160}
            onLoad={() => setLoaded(true)}
            className={`${loaded ? "block" : "hidden"} w-32 h-32`}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
    


    get post tosheet <!DOCTYPE html>
<html>
<head>
  <title>Data Input and Display</title>
</head>
<body>
  <h1>Enter Your Information</h1>
  <form id="myForm" method="post" action="https://script.google.com/macros/s/AKfycbw6sfA7oCtFd2dT26OT-Lv9TQCp6LjAJGVwHpU4CUuUhAsoFG9KdJ3n7DfL2_oQaMSJOQ/exec">
  
  <div>
    <label for="name">Name:</label>
    <input type="text" id="name" name="name" required>
  </div>
  <div>
    <label for="phone">Phone:</label>
    <input type="tel" id="phone" name="phone">
  </div>
  <div>
    <label for="province">Province:</label>
    <input type="text" id="province" name="province">
  </div>
  <div>
    <label for="district">District:</label>
    <input type="text" id="district" name="district">
  </div>
  <div>
    <label for="village">Village:</label>
    <input type="text" id="village" name="village">
  </div>
  <div>
    <label for="logistic_unit">Shal Unit:</label>
    <input type="text" id="logistic_unit" name="logistic_unit">
  </div>
  <button type="submit">Submit</button>
</form>
    

  <div id="status"></div>

  <h2>Data from Google Sheet</h2>
  <div id="dataDisplay"></div>

  <script>
    const form = document.getElementById('myForm');
    const statusDiv = document.getElementById('status');
    const dataDisplayDiv = document.getElementById('dataDisplay');
    const webAppUrl = 'https://script.google.com/macros/s/AKfycbw6sfA7oCtFd2dT26OT-Lv9TQCp6LjAJGVwHpU4CUuUhAsoFG9KdJ3n7DfL2_oQaMSJOQ/exec'; // Make sure this is your Web App URL

    form.addEventListener('submit', function(event) {
      event.preventDefault();
      fetch(form.action, {
        method: 'POST',
        body: new FormData(form)
      })
      .then(response => response.text())
      .then(data => {
        statusDiv.textContent = data;
        form.reset();
        fetchData(); // Refresh the displayed data after submission
      })
      .catch(error => {
        statusDiv.textContent = 'Error submitting data.';
        console.error('Error:', error);
      });
    });

    function fetchData() {
      fetch(webAppUrl) // Default method is GET
        .then(response => response.json())
        .then(data => {
          displayData(data);
        })
        .catch(error => {
          dataDisplayDiv.textContent = 'Error fetching data.';
          console.error('Error:', error);
        });
    }

    function displayData(data) {
      let html = '<table><thead><tr>';
      if (data.length > 0) {
        // Create table headers from the keys of the first object
        for (const key in data[0]) {
          html += `<th>${key}</th>`;
        }
        html += '</tr></thead><tbody>';

        // Create table rows from the data
        data.forEach(item => {
          html += '<tr>';
          for (const key in item) {
            html += `<td>${item[key]}</td>`;
          }
          html += '</tr>';
        });
        html += '</tbody></table>';
      } else {
        html = '<p>No data available.</p>';
      }
      dataDisplayDiv.innerHTML = html;
    }

    // Fetch data when the page loads
    fetchData();
  </script>
</body>
</html>


 <div className="relative w-full h-[400px] md:h-[400px] lg:h-[600px] rounded-lg overflow-hidden">

        {/* Background image */}
        <img
          alt="Sky Background"
          src="/image/30.png"
          className="absolute inset-0 w-full h-full object-cover dark:hidden"
        />

        <img
          alt="Dark Mode Background"
          src="/image/31.png"
          className="absolute inset-0 w-full h-full object-cover hidden dark:block"
        />

        {/* Centered Plane image */}
        <div className="relative z-10 flex h-full w-full items-center justify-center" data-aos="fade-right" data-aos-delay="200" data-aos-duration="1200">
          <img

            alt="C919 Flying"
            src={
              i18n.language === "la"
                ? "/c919/109.png"
                : i18n.language === "en"
                  ? "/c919/105.png"
                  : i18n.language === "zh"
                    ? "/c919/104.png"
                    : i18n.language === "th"
                      ? "/c919/107.png"
                      : i18n.language === "jp"
                        ? "/c919/113.png"
                        : i18n.language === "vi"
                          ? "/c919/108.png"
                          : "/c919/110.png"
            }
            className={`w-auto h-auto transition-transform duration-500 hover:scale-105 z-10 
        
        ${i18n.language === "la"
                ? "max-w-[70%] md:max-w-[85%] lg:max-w-[90%]"
                : "max-w-[90%]"

              }`
            }

          />
        </div>
      </div>


  ເບິ່ງຂໍ້ມູນໃນໂພດັກ
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
        <h1 className="text-3xl font-bold text-center text-[#0d7a68] mb-6">{t("product")}</h1>
        <div className="w-full max-w-7xl px-4 overflow-x-auto">
          
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

        
        </div>
  <div className="flex flex-wrap gap-4 mt-6 justify-center">
            <Button className="bg-[#0d7a68] text-white" onClick={handleRefresh} disabled={loading}>
              {t("refresh_data") || "Refresh Data"}
            </Button>
            <Button className="border-[#0d7a68] text-[#0d7a68]" onClick={onOpen}>
              {t("add_new_product") || "Add New Product"}
            </Button>
          </div>
        {/* Modal not expanded in this snippet */}
      </section>
    </DefaultLayout>
  );
}
