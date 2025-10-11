import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

  ],
  

  server: {
    // This tells Vite: if the frontend requests a path starting with /api
    // (like /api/users/login), forward it to http://localhost:5000
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Your backend URL
        changeOrigin: true,
        secure: false, // Set to true if your backend used https
        // rewrite: (path) => path.replace(/^\/api/, ''), // Use this if your backend doesn't expect the /api prefix
      },
    },
  },
})
