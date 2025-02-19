import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  const isProduction = mode === 'production';

  // Use environment variable or fallback
  const apiUrl = env.VITE_API_URL || (isProduction
    ? 'https://padre-ginos-fem.onrender.com'
    : 'http://localhost:3000');

  console.log('Vite Config:', {
    mode,
    command,
    apiUrl,
    isProduction
  });

  return {
    server: {
      port: 5173,
      proxy: !isProduction ? {
        "/api": {
          target: apiUrl,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '')
        },
        "/public": {
          target: apiUrl,
          changeOrigin: true,
          secure: false
        }
      } : undefined
    },
    preview: {
      port: 5173,
      host: true
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
      // Stringify all environment variables
      ...Object.keys(env).reduce((acc, key) => ({
        ...acc,
        [`process.env.${key}`]: JSON.stringify(env[key])
      }), {}),
      // Ensure VITE_API_URL is always defined
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
