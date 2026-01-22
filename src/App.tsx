import { Route, Routes } from "react-router-dom";
import { I18nextProvider } from "react-i18next";

import i18n from "./i18n";
import ProductsPage from "./pages/products";
import Logistics from "./components/logistics";
import DataCheck from "./components/data_check";
import Logistics_status from "./components/logistics_status";


import "aos/dist/aos.css";
import AboutPage from "@/pages/about";
import IndexPage from "@/pages/index";
import ThreeLeaves from "./components/three_leaves";
import Omellets from "./components/omelettes";
import Bank from "./components/bank";

import Dashboard from "./components/OMS-Trip-Dashboard/Dashboard";
import OMS_Trip_Tracker from "./components/oms-tirp-tracker";
import OMS_Special_Customers from "./components/customers";
import LoginPage from "./components/login";
import OMSDashboard from "./components/test";


function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <Routes>
        <Route element={<IndexPage />} path="/" />
        <Route element={<ProductsPage />} path="/product" />
        <Route element={<Omellets />} path="/omelette's" />
        <Route element={<ThreeLeaves />} path="/three_leaves" />
        <Route element={<AboutPage />} path="/about" />
        <Route element={<Logistics />} path="/logistics" />
        <Route element={<Bank />} path="/BlankPage" />
        <Route element={<OMS_Trip_Tracker />} path="/OMS-T" />
        <Route element={<DataCheck />} path="/dataCheck" />
        <Route element={<Logistics_status />} path="/logistics_status" />
        <Route element={< OMS_Special_Customers />} path="/OMS_Special_Customers" />
        <Route element={<  LoginPage />} path="/OMS_Login" />
        <Route element={<OMSDashboard />} path="/OMS_Dashboard" />
        <Route element={<Dashboard />} path="/oms-dashboard" />




      </Routes>
    </I18nextProvider>
  );
}

export default App;
