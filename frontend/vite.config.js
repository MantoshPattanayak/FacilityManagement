import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createHtmlPlugin } from 'vite-plugin-html';
import inspect from 'vite-plugin-inspect';
import instance from './env'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    inspect(),
    createHtmlPlugin({
      inject: {
        injectScript: `
          <script>
            // Custom script or analytics logic
          </script>
        `,
      },
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: '5173'
  },

  preview: {
    port: 5173
  },
  base: '/ama-bhoomi',
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
    emptyOutDir: true,
    chunkSizeWarningLimit: 1000, // Set the limit in KB
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // if (id.includes('react') || id.includes('react-dom')) {
            //   return 'react-vendors';
            // }
            // if (id.includes('lodash')) {
            //   return 'lodash';
            // }
            // return 'vendor';
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        },
      },
    },
  },
  optimizeDeps: {
    exclude: ['node_modules', 'dist', 'build'], // Exclude directories from being watched
  },
})
