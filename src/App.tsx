// App.js
import { Route, Routes } from "react-router-dom";
import { I18nextProvider } from "react-i18next";

import i18n from "./i18n";
// REMOVE: import { TranslationProvider } from "react-auto-google-translate";
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

import LoginPage from "./components/login";
import OMSDashboard from "./components/test";
import OMS_Help_Request from "./components/customers";
import Loading from "./components/loading";
import HSKApp from "./components/oms-tirp-tracker";

function App() {
  return (
    // REMOVE: <TranslationProvider originalLang="en">
    <I18nextProvider i18n={i18n}>
      <Routes>
        <Route element={<IndexPage />} path="/" />
        <Route element={<Omellets />} path="/oms-store" />
        <Route element={<AboutPage />} path="/about" />
        <Route element={<Logistics />} path="/logistics" />
        <Route element={<HSKApp />} path="/OMS_chinese" />
        <Route element={<OMS_Help_Request />} path="/help" />
        <Route element={<LoginPage />} path="/OMS_Login" />
        <Route element={<Loading />} path="/OMS-Loading" />
      </Routes>
    </I18nextProvider>
    // REMOVE: </TranslationProvider>
  );
}

export default App;