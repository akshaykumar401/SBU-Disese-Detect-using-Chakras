import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      tailwindcss()
    ],
    optimizeDeps: {
      exclude: ["@ffmpeg/ffmpeg", "@ffmpeg/util", "@ffmpeg/core"],
    },
    server: {
      headers: {
        "Cross-Origin-Opener-Policy": "same-origin",
        "Cross-Origin-Embedder-Policy": "require-corp",
      },
      proxy: {
        '/apii': {
          // Pointing to local backend dynamically or the Render URL if not found.
          // By default, your local wsgi.py backend is running on 5000.
          target: env.VITE_SERVER_URL || "http://127.0.0.1:5000",
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/apii/, ''),
        },
      },
    },
  };
});
