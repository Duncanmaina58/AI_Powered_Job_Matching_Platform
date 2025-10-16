import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  // ✅ Make sure this matches your GitHub repo name exactly (case-sensitive)
  base: '/',

  server: {
    proxy: {
      '/api': {
        // ✅ Change this to your live Render backend URL
        target: 'https://ai-powered-job-matching-platform.onrender.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
})
