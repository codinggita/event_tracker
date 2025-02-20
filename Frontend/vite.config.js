import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
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
