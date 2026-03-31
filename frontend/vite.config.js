import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // بورت الفرونت إند بتاعك
    proxy: {
      "/api": {
        target: "http://localhost:5000", // بورت الباك إند اللي أنتِ مشغلاه
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
