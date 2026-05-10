import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/build': 'http://localhost:8000',
      '/builds': 'http://localhost:8000',
      '/rebuild': 'http://localhost:8000',
      '/files': 'http://localhost:8000',
      '/sdk-catalog': 'http://localhost:8000',
    },
  },
})
