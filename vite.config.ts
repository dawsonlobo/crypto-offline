import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
        hmr: false,

    allowedHosts:[
      "15abf604b60c.ngrok-free.app"
    ]
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
});
