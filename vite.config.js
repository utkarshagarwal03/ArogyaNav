import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Absolute root base path for Vercel & server deployments
  server: {
    host: true, // Listen on all local IP addresses (0.0.0.0)
  },
})
