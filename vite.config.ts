import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    VitePWA({
      registerType: "autoUpdate",

      manifest: {
        name: "FleetDash",
        short_name: "FleetDash",
        description: "Fleet Management Dashboard",
        theme_color: "#2563eb",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",

        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
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
  },
});