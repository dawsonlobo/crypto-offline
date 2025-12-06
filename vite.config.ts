import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

export default defineConfig({
  base: "./",   // ⬅⬅⬅ FIX FOR ELECTRON + APPIMAGE
  plugins: [react()],
  // server: {
  //   hmr: false,
  //   port: 80,     // 👈 change port here
  //   host: true,  // allow LAN access (required for port 80 sometimes)
  // },
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
