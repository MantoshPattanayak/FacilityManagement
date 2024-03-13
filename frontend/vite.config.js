import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: '5173'
  },
  preview: {
    port: 5173
  },
  build: {
    minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
        format: {
          comments: true
        },
      },
    outDir: '../dist/frontend',
    emptyOutDir: true
  }
})
