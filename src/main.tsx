import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import { Provider } from "react-redux";
import { store } from "./store/store";

import { SidebarProvider } from "./context/SidebarContext";

import { Toaster } from "react-hot-toast";

import "leaflet/dist/leaflet.css";
import "./index.css";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <React.StrictMode>
    <Provider store={store}>
      <SidebarProvider>

        <App />

        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 3000,
          }}
        />

      </SidebarProvider>
    </Provider>
  </React.StrictMode>
);