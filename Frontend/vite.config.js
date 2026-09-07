import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['farmiax-evps.onrender.com'],
  },

  preview: {
    allowedHosts: ['farmiax-evps.onrender.com'],
  },
})
