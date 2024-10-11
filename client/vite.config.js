import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:8800",
        changeOrigin: true, // Moved inside the proxy object for "/api"
        rewrite: (path) => path.replace(/^\/api/, ""), // Optional: removes "/api" from the proxied request path
      },
    },
  },
});
