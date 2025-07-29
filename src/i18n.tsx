import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import enTranslations from "./locales/en.json";
import laTranslations from "./locales/la.json";
import zhTranslations from "./locales/zh.json";
import thTranslations from "./locales/th.json";

const savedLanguage = localStorage.getItem("language") || "en";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslations },
    la: { translation: laTranslations },
    zh: { translation: zhTranslations },
    th: { translation: thTranslations },
  },
  lng: savedLanguage,
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
