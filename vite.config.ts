/// <reference types="vitest" />

import { defineConfig } from "vite";
import analog from "@analogjs/platform";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  build: {
    target: ["es2020"],
  },
  resolve: {
    mainFields: ["module"],
  },
  plugins: [
    analog({
      vite: {
        // Required to use the Analog SFC format
        // experimental: {
        //   supportAnalogFormat: true,
        // },
      },
      nitro: {
        runtimeConfig: {
          githubClientId: process.env["GITHUB_CLIENT_ID"],
          githubClientSecret: process.env["GITHUB_CLIENT_SECRET"],
        },
      },
    }),
  ],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["src/test-setup.ts"],
    include: ["**/*.spec.ts"],
    reporters: ["default"],
  },
  define: {
    "import.meta.vitest": mode !== "production",
  },
}));
