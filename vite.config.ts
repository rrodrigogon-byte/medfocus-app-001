import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    host: "0.0.0.0",
    strictPort: true,
    cors: true,
    hmr: {
      protocol: "wss",
      clientPort: 5173,
    },
  },
  resolve: {
    alias: {
      "@": "/client/src",
    },
  },
  optimizeDeps: {
    exclude: [],
  },
});
