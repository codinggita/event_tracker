export default defineConfig({
  base: '/', // <- Yeh important hai Render ke liye
  plugins: [react()],
  server: {
    port: 5173,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@chakra-ui/react": "@chakra-ui/react/dist/index.mjs",
    },
  },
});
