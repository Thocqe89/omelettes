import { Route, Routes } from "react-router-dom";
import { I18nextProvider } from "react-i18next";

import i18n from "./i18n";
import ProductsPage from "./pages/products";
import Logistics from "./components/logistics";
// import Logistics_dashboard from "./components/logistics_dashboard";
import DataCheck from "./components/data_check";
import Logistics_status from "./components/logistics_status";


import "aos/dist/aos.css";
import AboutPage from "@/pages/about";
// import StorePage from "./components/omelettes";
// import BlogPage from "@/pages/blog";
import IndexPage from "@/pages/index";
import ThreeLeaves from "./components/three_leaves";
import Omellets from "./components/omelettes";
import Bank from "./components/bank";

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <Routes>
        <Route element={<IndexPage />} path="/" />
        <Route element={<ProductsPage />} path="/product" />
        <Route element={<Omellets />} path="/omellets" />
         <Route element={<ThreeLeaves />} path="/thee_eaves" /> 
          <Route element={<Omellets />} path="/omelettes" /> 
         <Route element={<AboutPage />} path="/about" /> 
        <Route element={<Logistics />} path="/logistics" />
        <Route element={<Bank />} path="/BankPage" />
        <Route element={<DataCheck />} path="/dataCheck" />
        <Route element={<Logistics_status />} path="/logistics_status" />
      </Routes>
    </I18nextProvider>
  );
}

export default App;
