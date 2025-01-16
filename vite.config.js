import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";



// https://vite.dev/config/
export default defineConfig({
  // set api location
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "https://padre-ginos-api.vercel.app",
        changeOrigin: true,
        secure: false
      },
      "/public": {
        target: "https://padre-ginos-api.vercel.app",
        changeOrigin: true,
        secure: false
      }
    }
  },
  plugins: [
    react(),
    TanStackRouterVite()
  ],
  test: {

    environment: "happy-dom",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },

  },

})
