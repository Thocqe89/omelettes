import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastProvider } from "@heroui/react";

import App from "./App.tsx";
import { Provider } from "./provider.tsx";
import "@/styles/globals.css";
// import PwaInstallPrompt from "./components/InstallPrompt.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* <PwaInstallPrompt/> */}
    <BrowserRouter>
      <ToastProvider placement="top-right" toastOffset={60} />
      <Provider>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
);
