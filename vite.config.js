import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Universal relative base path for GitHub Pages & custom domains
  server: {
    host: true, // Listen on all local IP addresses (0.0.0.0)
  },
})
