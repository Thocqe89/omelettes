import { Route, Routes } from "react-router-dom";
import { I18nextProvider } from "react-i18next";

import i18n from "./i18n";
import ProductsPage from "./pages/products";
import Logistics from "./components/logistics";
import Logistics_dashboard from "./components/logistics_dashboard";
import DataCheck from "./components/data_check";

// Fix import typo here:
import Logistics_status from "./components/logistice_status";

import AboutPage from "@/pages/about";
import StorePage from "@/pages/store"; // Fix import typo here
import BlogPage from "@/pages/blog";
import IndexPage from "@/pages/index";

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <Routes>
        <Route element={<IndexPage />} path="/" />

        <Route element={<ProductsPage />} path="/product" />
        <Route element={<StorePage />} path="/store" />
        <Route element={<BlogPage />} path="/blog" />
        <Route element={<AboutPage />} path="/about" />
        <Route element={<Logistics />} path="/logistics" />
        <Route element={<Logistics_dashboard />} path="/logistics_dashboard" />
        <Route element={<DataCheck />} path="/dataCheck" />
        <Route element={<Logistics_status />} path="/logistics_status" />
      </Routes>
    </I18nextProvider>
  );
}

export default App;
