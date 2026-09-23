import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Production build lands inside the Python package so `helpline-watch serve` is one process.
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: { outDir: '../backend/helpline_watch/static', emptyOutDir: true },
  server: { port: 5173, proxy: { '/api': { target: 'http://127.0.0.1:8787', changeOrigin: true } } },
})
