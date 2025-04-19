// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: './', // 👈 ADD THIS LINE
  plugins: [react()],
  server: {
    port: 5173,
  },
  resolve: {
    alias: {
      "@chakra-ui/react": "@chakra-ui/react/dist/index.mjs",
    },
  },
});
