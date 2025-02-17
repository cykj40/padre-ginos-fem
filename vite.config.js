import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  // set api location
  server: {
    port: 5173,
    proxy: mode === 'development' ? {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false
      },
      "/public": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      },
      "/style.css": {
        target: "http://localhost:3000/public",
        changeOrigin: true,
        secure: false
      },
      "/padre_gino.svg": {
        target: "http://localhost:3000/public",
        changeOrigin: true,
        secure: false
      },
      "/Pacifico-Regular.ttf": {
        target: "http://localhost:3000/public",
        changeOrigin: true,
        secure: false
      },
      "/pizzas": {
        target: "http://localhost:3000/public",
        changeOrigin: true,
        secure: false
      }
    } : {}
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
  define: {
    'process.env.VITE_API_URL': JSON.stringify(mode === 'production'
      ? 'https://padre-ginos-fem.onrender.com/'
      : ''
    )
  },
  plugins: [
    react(),
    TanStackRouterVite(),
    {
      name: 'html-transform',
      transformIndexHtml(html) {
        return html.replace(
          /%VITE_API_URL%/g,
          mode === 'production'
            ? 'https://padre-ginos-fem.onrender.com/'
            : ''
        )
      }
    }
  ],
  test: {
    environment: "happy-dom",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
  },
}))
