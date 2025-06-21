import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,              // allow external access (0.0.0.0)
    allowedHosts: 'all',     // allow all domains (including ngrok, localhost, etc.)
  },
})
