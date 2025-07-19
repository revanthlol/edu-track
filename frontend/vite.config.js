// frontend/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // --- ADD THIS SERVER CONFIGURATION ---
  server: {
    proxy: {
      // string shorthand: http://localhost:5173/api -> http://localhost:3001/api
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      }
    }
  }
  // --- END OF NEW CONFIGURATION ---
})