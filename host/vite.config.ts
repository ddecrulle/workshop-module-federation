import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import federation from "@originjs/vite-plugin-federation";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: "app",
      remotes: {
        remoteApp: {
          external: `Promise.resolve(import.meta.env["VITE_REMOTE_URL"] + "/assets/remoteEntry.js")`,
          externalType: "promise",
        },
      },
      shared: ["react", "react-dom"],
    }),
    tsconfigPaths(),
  ],
  build: {
    modulePreload: false,
    target: "esnext",
    minify: false,
    cssCodeSplit: false,
  },
});
