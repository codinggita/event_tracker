// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";  // Add this import

export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    port: 5173,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),  // Add this line
      "@chakra-ui/react": "@chakra-ui/react/dist/index.mjs",
    },
  },
});