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
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true
        },
        '/public': {
          target: apiUrl,
          changeOrigin: true
        }
      }
    },
    preview: {
      port: 5173,
      host: true,
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true
        },
        '/public': {
          target: apiUrl,
          changeOrigin: true
        }
      }
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
      commonjsOptions: {
        include: [/node_modules/],
        transformMixedEsModules: true
      }
    },
    define: {
      'process.env.NODE_ENV': JSON.stringify(mode),
      'process.env.VITE_API_URL': JSON.stringify(apiUrl)
    },
    plugins: [
      react({
        jsxRuntime: 'automatic',
        jsxImportSource: 'react',
        babel: {
          plugins: [
            ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }]
          ]
        }
      }),
      TanStackRouterVite()
    ],
    optimizeDeps: {
      include: ['react', 'react-dom']
    },
    test: {
      environment: "happy-dom",
      coverage: {
        provider: "v8",
        reporter: ["text", "json", "html"],
      },
    },
  }
})
