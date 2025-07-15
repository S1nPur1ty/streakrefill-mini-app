import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    global: 'globalThis',
  },
  optimizeDeps: {
    include: ['buffer'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          wagmi: ['wagmi', '@wagmi/core'],
          ui: ['phosphor-react', 'react-custom-roulette']
        }
      }
    }
  },
  server: {
    allowedHosts: true,
    proxy: {
      '/api/bitrefill': {
        target: 'https://api.bitrefill.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/bitrefill/, ''),
        headers: {
          'User-Agent': 'streak-refill-app/1.0'
        }
      }
    }
  },
});
