import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastProvider } from "@heroui/react";
import { HelmetProvider } from "react-helmet-async";

import App from "./App.tsx";
import { Provider } from "./provider.tsx";
import "@/styles/globals.css";
// import PwaInstallPrompt from "./components/InstallPrompt.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* <PwaInstallPrompt/> */}
    <BrowserRouter>
      <HelmetProvider>
        <ToastProvider placement="top-right" toastOffset={60} />
        <Provider>
          <App />
        </Provider>
      </HelmetProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
