import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3030,
    host: true,
    open: true,
    proxy: {
      '/ossService': {
        // target: 'http://172.20.232.54:3000/ossService',
        target: 'http://124.71.233.254:3000/ossService',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/ossService/, '')
      }
    }
  },
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
