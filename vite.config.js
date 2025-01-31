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
        target: "https://padre-ginos-api-git-main-cykj40s-projects.vercel.app/",
        changeOrigin: true,
        secure: false,
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
      },
      "/public": {
        target: "https://padre-ginos-api-git-main-cykj40s-projects.vercel.app/",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/public/, ''),
        headers: {
          'Access-Control-Allow-Origin': '*'
        }
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
