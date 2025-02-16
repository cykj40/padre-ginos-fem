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
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false
      },
      "/public": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'tanstack-vendor': ['@tanstack/react-query', '@tanstack/react-router']
        }
      }
    }
  },
  plugins: [react({
    babel: {
      plugins: [
        [
          "babel-plugin-react-compiler",
          {
            target: "19"
          }
        ]
      ]
    }
  }), TanStackRouterVite()],
  test: {
    environment: "happy-dom",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
  },
})
