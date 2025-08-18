import * as React from "react";
import { useTranslation } from "react-i18next";
import DefaultLayout from "@/layouts/default";

export default function BankPage() {
  const { t } = useTranslation();

  return (
    <DefaultLayout>
      <section className="min-h-screen flex flex-col items-center justify-center px-4 py-10 bg-gray-50 dark:bg-gray-900">
        <img
          src="/image/menu/th.png" // replace with your image
          alt={t("coming_soon_image") || "Coming Soon Illustration"}
          className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg h-auto mb-6 animate-fade-in"
        />
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-[#0d7a68] ">
          {t("coming_soon") || "Coming Soon"}
        </h1>
        {/* <p className="mt-4 text-center text-gray-600 dark:text-gray-400 text-base sm:text-lg">
          {t("bank_page_message") || "Our bank services will be available soon. Stay tuned!"}
        </p> */}
      </section>
    </DefaultLayout>
  );
}
