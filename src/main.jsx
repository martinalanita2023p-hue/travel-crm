import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { ToastContainer } from "react-toastify";

import "./styles/theme.css";
import "./index.css";
import "./styles/layout.css";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";

import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />

    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover
      theme="light"
    />

    <SpeedInsights />
  </StrictMode>
);