import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';
  const apiUrl = isProduction
    ? 'https://padre-ginos-fem.onrender.com'
    : 'http://localhost:3000';

  return {
    server: {
      port: 5173,
      proxy: !isProduction ? {
        "/api": {
          target: apiUrl,
          changeOrigin: true,
          secure: false
        },
        "/public": {
          target: apiUrl,
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
      'process.env.VITE_API_URL': JSON.stringify(apiUrl)
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
  }
})
