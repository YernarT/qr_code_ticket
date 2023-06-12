import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

import path from "path";
import autoprefixer from "autoprefixer";
import sass from "sass";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 3200,
  },

  resolve: {
    alias: {
      "@": path.resolve(path.resolve(), "./src"),
    },
  },

  plugins: [react()],

  css: {
    postcss: {
      plugins: [
        autoprefixer({
          overrideBrowserslist: "last 2 versions",
        }),
      ],
    },

    preprocessorOptions: {
      sass: {
        implementation: sass,
      },
    },
  },
});
