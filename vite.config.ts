import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: "node",
    include: [
      "server/**/*.test.ts",
      "electron/**/*.test.mjs",
      "src/**/*.test.ts",
      "companion/**/*.test.ts",
      "scripts/**/*.test.mjs",
    ],
    setupFiles: ["server/testing/setup.ts"],
    fileParallelism: false,
    testTimeout: 20_000,
    hookTimeout: 30_000,
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: "0.0.0.0",
    port: Number(process.env.OMB_UI_PORT) || 5199,
    watch: {
      ignored: ["**/release/**", "**/build/**", "**/dist/**", "**/electron/resources/**"],
    },
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8799",
        changeOrigin: true,
        ws: true,
      },
    },
  },
});
