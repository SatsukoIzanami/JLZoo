import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  const isGitHubPages = env.GITHUB_PAGES === "true";

  return {
    plugins: [react()],
    base: isGitHubPages ? "/JLZoo/" : "/",
    server: {
      port: 5173,
      open: true,
      proxy: {
        "/api": {
          target: "http://localhost:3000",
          changeOrigin: true,
        },
        "/images": {
          target: "http://localhost:3000",
          changeOrigin: true,
        },
      },
    },
    // Local `npm run preview` proxies to Zoo.Api on :3000 (run `npm start` from repo root).
    preview: {
      port: 4173,
      proxy: {
        "/api": {
          target: "http://localhost:3000",
          changeOrigin: true,
        },
        "/images": {
          target: "http://localhost:3000",
          changeOrigin: true,
        },
      },
    },
  };
});
