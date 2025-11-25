import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

export default defineConfig({
  base: "./",   // ⬅⬅⬅ FIX FOR ELECTRON + APPIMAGE
  plugins: [react()],
  server: {
    hmr: false
  },
  optimizeDeps: {
    include: ['@noble/hashes'],
    exclude: ['lucide-react'],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
