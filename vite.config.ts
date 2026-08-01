import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],

build: {
  chunkSizeWarningLimit: 1000,

  rollupOptions: {
    output: {
      manualChunks(id) {
        if (id.includes("node_modules")) {
          if (
            id.includes("react") ||
            id.includes("react-dom") ||
            id.includes("react-router-dom")
          ) {
            return "react";
          }

          if (
            id.includes("@reduxjs/toolkit") ||
            id.includes("react-redux")
          ) {
            return "redux";
          }

          if (
            id.includes("chart.js") ||
            id.includes("react-chartjs-2") ||
            id.includes("recharts")
          ) {
            return "charts";
          }

          if (
            id.includes("leaflet") ||
            id.includes("react-leaflet")
          ) {
            return "maps";
          }

          if (
            id.includes("axios") ||
            id.includes("socket.io-client") ||
            id.includes("xlsx") ||
            id.includes("jspdf")
          ) {
            return "utils";
          }
        }
      },
    },
  },
}
});